import {z} from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { title } from 'process'


export const todoRouter = createTRPCRouter({

    delete:publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({  ctx, input }) => {        
        return await ctx.db.todo.delete({ where: { id: input.id } })
    }),
    getAll:publicProcedure
    .query(async ({  ctx }) => {        
        return await ctx.db.todo.findMany()
    }),
    create:publicProcedure
    .input(z.object({title:z.string(), description:z.string()}))
    .mutation(async ({  ctx, input }) => {        
        return await ctx.db.todo.create({ data: input })
    }),
       
})