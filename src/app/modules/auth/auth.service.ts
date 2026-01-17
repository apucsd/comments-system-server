import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { User } from '../user/user.model';
import { ILoginData } from '../../../types/auth';


const loginUserFromDB = async (payload: ILoginData) => {
      const { email, password } = payload;
      if (!password) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is required');
      }
      const isExistUser = await User.findOne({ email }).select('+password');
      if (!isExistUser) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
      }


      if (isExistUser.status === 'delete') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'It looks like your account has been deactivated.');
      }


      if (password && !(await User.isMatchPassword(password, isExistUser.password))) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
      }
      const jwtPayload = {
            id: isExistUser._id,
            role: isExistUser.role,
            email: isExistUser.email,
      };

      const accessToken = jwtHelper.createToken(
            jwtPayload,
            config.jwt.jwt_access_token_secret as Secret,
            config.jwt.access_token_expire_in as string
      );
      const refreshToken = jwtHelper.createToken(
            jwtPayload,
            config.jwt.jwt_refresh_token_secret as Secret,
            config.jwt.refresh_token_expire_in as string
      );

      return { accessToken, refreshToken };
};











export const AuthService = {

      loginUserFromDB,

};
