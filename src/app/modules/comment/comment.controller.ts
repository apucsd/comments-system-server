import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CommentService } from './comment.service';
import pick from '../../../shared/pick';

const createComment = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      const result = await CommentService.createCommentIntoDB({
            ...req.body,
            author: user?.id,
      });
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Comment created successfully',
            data: result,
      });
});

const getAllComments = catchAsync(async (req: Request, res: Response) => {
      const filters = pick(req.query, ['searchTerm', 'sort', 'limit', 'page']);
      const result = await CommentService.getAllCommentsFromDB(req.user?.id, filters);
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Comments fetched successfully',
            data: result,
      });
});

const replyComment = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      const { id } = req.params;
      const result = await CommentService.replyCommentIntoDB(id, {
            ...req.body,
            author: user?.id,
      });
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Reply added successfully',
            data: result,
      });
});

const likeComment = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      const { id } = req.params;
      const result = await CommentService.likeCommentInDB(id, user.id);
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Comment liked successfully',
            data: result,
      });
});

const dislikeComment = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      const { id } = req.params;
      const result = await CommentService.dislikeCommentInDB(id, user.id);
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Comment disliked successfully',
            data: result,
      });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      const { id } = req.params;
      const result = await CommentService.updateCommentInDB(id, user.id, req.body);
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Comment updated successfully',
            data: result,
      });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      const { id } = req.params;
      const result = await CommentService.deleteCommentFromDB(id, user.id);
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Comment deleted successfully',
            data: result,
      });
});

export const CommentController = {
      createComment,
      getAllComments,
      replyComment,
      likeComment,
      dislikeComment,
      updateComment,
      deleteComment,
};
