import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { Configuration, OpenAIApi } from "openai";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAI = new OpenAIApi(configuration);

export const imageRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const images = await ctx.prisma.imageCollection.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
    return images;
  }),

  generatePrompt: privateProcedure
    .input(
      z.object({
        what: z.string().min(1).max(255),
      })
    )
    .query(async ({ input }) => {
      const aiResponse = await openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert DALLE prompts and generate excellent prompts, to generate accurate images from DALLE",
          },
          {
            role:"user",
            content:`Create a very descriptive prompt for DALLE to generate an image about ${input.what}, return a prompt wrapped inside angle brackets.`
          }
        ],
      });
      const prompt =  aiResponse.data.choices[0]?.message?.content;      
      return prompt;
    }),
});
