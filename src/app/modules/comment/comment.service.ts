import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import QueryBuilder from '../../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { IComment } from './comment.interface';
import { Comment } from './comment.model';

const createCommentIntoDB = async (payload: IComment) => {
      const result = await Comment.create(payload);
      return result;
};

const getAllCommentsFromDB = async (userId: string, query: Record<string, unknown>) => {
      const commentQuery = new QueryBuilder(
            Comment.find()
                  .populate('author', 'name email profile')
                  .populate({
                        path: 'replies',
                        populate: { path: 'author', select: 'name email profile' },
                  }),
            query
      )
            .search(['content'])
            .filter()
            .sort()
            .paginate()
            .fields();

      const meta = await commentQuery.countTotal();
      const data = await commentQuery.modelQuery;

      const formattedData = data.map((comment: any) => {
            const commentObj = comment.toObject();
            const isLiked = userId ? commentObj.likes.some((id: any) => id.toString() === userId) : false;
            const isDisliked = userId ? commentObj.dislikes.some((id: any) => id.toString() === userId) : false;

            const replies = commentObj.replies?.map((reply: any) => {
                  return {
                        ...reply,
                        isLiked: userId ? reply.likes?.some((id: any) => id.toString() === userId) : false,
                        isDisliked: userId ? reply.dislikes?.some((id: any) => id.toString() === userId) : false,
                  };
            });

            return {
                  ...commentObj,
                  isLiked,
                  isDisliked,
                  replies,
            };
      });

      return {
            meta,
            data: formattedData,
      };
};

const replyCommentIntoDB = async (id: string, payload: Partial<IComment>) => {
      const comment = await Comment.findById(id);
      if (!comment) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
      }

      const reply = await Comment.create({
            ...payload,
      });

      await Comment.findByIdAndUpdate(id, {
            $push: { replies: reply._id },
      });

      return reply;
};

const likeCommentInDB = async (id: string, userId: string) => {
      const comment = await Comment.findById(id);
      if (!comment) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
      }

      const userObjectId = new Types.ObjectId(userId);
      const isLiked = comment.likes.some((like) => like.equals(userObjectId));
      const isDisliked = comment.dislikes.some((dislike) => dislike.equals(userObjectId));

      let updateQuery = {};

      if (isLiked) {
            updateQuery = {
                  $pull: { likes: userObjectId },
                  $inc: { likeCount: -1 },
            };
      } else {
            if (isDisliked) {
                  updateQuery = {
                        $pull: { dislikes: userObjectId },
                        $addToSet: { likes: userObjectId },
                        $inc: { dislikeCount: -1, likeCount: 1 },
                  };
            } else {
                  updateQuery = {
                        $addToSet: { likes: userObjectId },
                        $inc: { likeCount: 1 },
                  };
            }
      }

      const result = await Comment.findByIdAndUpdate(id, updateQuery, {
            new: true,
      });
      return result;
};

const dislikeCommentInDB = async (id: string, userId: string) => {
      const comment = await Comment.findById(id);
      if (!comment) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
      }

      const userObjectId = new Types.ObjectId(userId);
      const isLiked = comment.likes.some((like) => like.equals(userObjectId));
      const isDisliked = comment.dislikes.some((dislike) => dislike.equals(userObjectId));

      let updateQuery = {};

      if (isDisliked) {
            updateQuery = {
                  $pull: { dislikes: userObjectId },
                  $inc: { dislikeCount: -1 },
            };
      } else {
            if (isLiked) {
                  updateQuery = {
                        $pull: { likes: userObjectId },
                        $addToSet: { dislikes: userObjectId },
                        $inc: { likeCount: -1, dislikeCount: 1 },
                  };
            } else {
                  updateQuery = {
                        $addToSet: { dislikes: userObjectId },
                        $inc: { dislikeCount: 1 },
                  };
            }
      }

      const result = await Comment.findByIdAndUpdate(id, updateQuery, {
            new: true,
      });
      return result;
};

const updateCommentInDB = async (id: string, userId: string, payload: Partial<IComment>) => {
      const comment = await Comment.findById(id);
      if (!comment) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
      }
      if (comment.author.toString() !== userId) {
            throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
      }

      const result = await Comment.findByIdAndUpdate(id, payload, { new: true });
      return result;
};

const deleteCommentFromDB = async (id: string, userId: string) => {
      const comment = await Comment.findById(id);
      if (!comment) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
      }
      if (comment.author.toString() !== userId) {
            throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
      }

      const result = await Comment.findByIdAndDelete(id);
      return result;
};

export const CommentService = {
      createCommentIntoDB,
      getAllCommentsFromDB,
      replyCommentIntoDB,
      likeCommentInDB,
      dislikeCommentInDB,
      updateCommentInDB,
      deleteCommentFromDB,
};
