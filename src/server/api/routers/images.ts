import {z} from "zod";

import { createTRPCRouter,publicProcedure } from "~/server/api/trpc";


export const imageRouter = createTRPCRouter({
    getAll:publicProcedure.query(async ({ctx})=>{
        const images = await ctx.prisma.imageCollection.findMany({
            take:100,
            orderBy:[{createdAt:"desc"}]
        });
        console.log("images ",images);
        return [];
    })
})