"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const zod_1 = require("zod");
const createCommentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string({
            required_error: 'Content is required',
        }),
    }),
});
const replyCommentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string({
            required_error: 'Content is required',
        }),
    }),
});
const updateCommentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string({
            required_error: 'Content is required',
        }),
    }),
});
exports.CommentValidation = {
    createCommentZodSchema,
    replyCommentZodSchema,
    updateCommentZodSchema,
};
