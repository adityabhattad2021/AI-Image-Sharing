import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { Configuration, OpenAIApi } from "openai";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  analytics: true,
});

const openAI = new OpenAIApi(configuration);

export const imageRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const images = await ctx.prisma.imageCollection.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
      });

      let nextCursor: typeof cursor | undefined;

      if (images.length > limit) {
        const nextItem = images.pop() as (typeof images)[number];
        nextCursor = nextItem.id;
      }
      return { images, nextCursor };
    }),

  generatePrompt: privateProcedure
    .input(
      z.object({
        what: z.string().min(1).max(100),
        cursor: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const authorId = ctx.userId;
        const { success } = await ratelimit.limit(authorId);
        console.log("Susdsds",success);
        
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS",message:"Only 2 request per minute are allowed." });
        const aiResponse = await openAI.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert DALLE prompts and generate excellent prompts, to generate accurate images from DALLE",
            },
            {
              role: "user",
              content: `Create a very descriptive prompt for DALLE to generate an image about ${input.what}, return a prompt wrapped inside angle brackets.`,
            },
          ],
        });
        const prompt = aiResponse.data.choices[0]?.message?.content;
        return prompt;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not get the prompt",
        });
      }
    }),

  generateImages: privateProcedure
    .input(
      z.object({
        description: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const authorId = ctx.userId;
        const { success } = await ratelimit.limit(authorId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

        const aiResponse = await openAI.createImage({
          prompt: input.description,
          n: 4,
          size: "1024x1024",
        });
        const images = aiResponse.data.data;
        return images;
      } catch (err) {
        console.log("OPEN AI ERROR: ", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not get the image data",
        });
      }
    }),

  generateVariations: privateProcedure
    .input(
      z.object({
        imageFile: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const authorId = ctx.userId;
        const { success } = await ratelimit.limit(authorId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const buffer: Buffer = Buffer.from(input.imageFile, "base64");
        const file: any = buffer;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        file.name = "image.png";
        const aiResponse = await openAI.createImageVariation(
          file as File,
          4,
          "1024x1024"
        );
        const genereateImages = aiResponse.data.data;
        return genereateImages;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cannot get image variations",
        });
      }
    }),

  create: privateProcedure
    .input(
      z.object({
        images: z.array(z.string().min(1).max(1000)),
        prompt: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const allImages = [];
      for (const image of input.images) {
        const randomHeight = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
        const uploadedImage = await cloudinary.uploader.upload(image, {
          width: 1024,
          height: randomHeight,
          crop: "fill",
        });
        console.log("uploadedImage: ", uploadedImage);

        const imageObj = await ctx.prisma.imageCollection.create({
          data: {
            imageUrl: uploadedImage.secure_url,
            prompt: input.prompt,
            authorId,
          },
        });
        allImages.push(imageObj);
      }
      return allImages;
    }),

  getUserImages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const authorId = ctx.userId;
      const images = await ctx.prisma.imageCollection.findMany({
        where: { authorId },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
      });
      let nextCursor: typeof cursor | undefined;
      if (images.length > limit) {
        const nextItem = images.pop() as (typeof images)[number];
        nextCursor = nextItem.id;
      }
      return { images, nextCursor };
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const imageObj = await ctx.prisma.imageCollection.findUnique({
        where: { id: input.id },
      });
      if (userId !== imageObj?.authorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this image",
        });
      }
      const image = await ctx.prisma.imageCollection.delete({
        where: { id: input.id },
      });
      return image;
    }),
});
