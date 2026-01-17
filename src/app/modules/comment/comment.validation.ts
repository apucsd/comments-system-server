import { z } from 'zod';

const createCommentZodSchema = z.object({
      body: z.object({
            content: z.string({
                  required_error: 'Content is required',
            }),
      }),
});

const replyCommentZodSchema = z.object({
      body: z.object({
            content: z.string({
                  required_error: 'Content is required',
            }),
      }),
});

const updateCommentZodSchema = z.object({
      body: z.object({
            content: z.string({
                  required_error: 'Content is required',
            }),
      }),
});

export const CommentValidation = {
      createCommentZodSchema,
      replyCommentZodSchema,
      updateCommentZodSchema,
};
