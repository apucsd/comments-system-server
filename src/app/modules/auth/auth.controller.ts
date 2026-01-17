import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import config from '../../../config';

const loginUser = catchAsync(async (req: Request, res: Response) => {
      const { ...loginData } = req.body;
      const { accessToken, refreshToken } = await AuthService.loginUserFromDB(loginData);
      res.cookie('refreshToken', refreshToken, {
            secure: config.node_env === 'production',
            httpOnly: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 365,
      });
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'User login successfully',
            data: {
                  accessToken,
            },
      });
});

export const AuthController = {
      loginUser,
};
