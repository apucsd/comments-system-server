import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
      '/',
      auth(USER_ROLES.USER),
      validateRequest(CommentValidation.createCommentZodSchema),
      CommentController.createComment
);

router.get('/', CommentController.getAllComments);

router.post(
      '/:id/reply',
      auth(USER_ROLES.USER),
      validateRequest(CommentValidation.replyCommentZodSchema),
      CommentController.replyComment
);

router.patch('/:id/like', auth(USER_ROLES.USER), CommentController.likeComment);

router.patch('/:id/dislike', auth(USER_ROLES.USER), CommentController.dislikeComment);

router.patch(
      '/:id',
      auth(USER_ROLES.USER),
      validateRequest(CommentValidation.updateCommentZodSchema),
      CommentController.updateComment
);

router.delete('/:id', auth(USER_ROLES.USER), CommentController.deleteComment);

export const CommentRoutes = router;
