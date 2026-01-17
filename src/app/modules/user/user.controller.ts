import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const { ...userData } = req.body;
      const result = await UserService.createUserToDB(userData);

      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'User created successfully. Please login to continue',
            data: result,
      });
});

export const UserController = {
      createUser,
};
