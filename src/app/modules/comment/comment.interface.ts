import { Model, Types } from 'mongoose';

export type IComment = {
      author: Types.ObjectId;
      content: string;
      likes: Types.ObjectId[];
      dislikes: Types.ObjectId[];
      replies: Types.ObjectId[];
      likeCount: number;
      dislikeCount: number;
};

export type CommentModel = Model<IComment, Record<string, unknown>>;
