import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "~/schema/todo";
import { get } from "http";
import { TodoEntry } from "~/types/todo";

export const todoRouter = createTRPCRouter({
  delete: publicProcedure
    .input(deleteTodoSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.todo.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        owner: {
          select: {
            name: true,
            email: true,
            // id: true,
            // image: true
          },
        },
      },
    });
  }),
  create: publicProcedure
    .input(createTodoSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error("session not found");
      }
      return await ctx.db.todo.create({
        data: {
          title: input.title,
          description: input.description,
          ownerId: ctx.session.user.id,
        },
      });
    }),
  update: publicProcedure
    .input(updateTodoSchema)
    .mutation(async ({ ctx, input }) => {
      const prev = await ctx.db.todo.findUniqueOrThrow({
        where: { id: input.id },
      });
      if (!ctx.session) {
        throw new Error("session not found");
      }
      if (prev.ownerId !== ctx.session.user.id) {
        throw new Error("not authorized to update this todo");
      }
      const newtodo = await ctx.db.todo.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
        },
      });
      return newtodo;
    }),
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }): Promise<TodoEntry> => {
      return await ctx.db.todo.findUniqueOrThrow({
        where: { id: input.id },
        select: {
          id: true,
          title: true,
          description: true,
          owner: {
            select: {
              name: true,
              email: true,
              id:true
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
});
