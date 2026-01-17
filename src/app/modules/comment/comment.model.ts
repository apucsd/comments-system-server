import { Schema, model } from 'mongoose';
import { IComment, CommentModel } from './comment.interface';

const commentSchema = new Schema<IComment, CommentModel>(
      {
            author: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            content: {
                  type: String,
                  required: true,
            },
            likes: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                  },
            ],
            dislikes: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                  },
            ],
            replies: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'Comment',
                  },
            ],
            likeCount: {
                  type: Number,
                  default: 0,
            },
            dislikeCount: {
                  type: Number,
                  default: 0,
            },
      },
      {
            timestamps: true,
            toJSON: {
                  virtuals: true,
            },
      }
);

export const Comment = model<IComment, CommentModel>('Comment', commentSchema);
