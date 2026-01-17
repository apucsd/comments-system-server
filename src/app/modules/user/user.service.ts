import { StatusCodes } from 'http-status-codes';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';

import { IUser } from './user.interface';
import { User } from './user.model';


const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
      //set role
      payload.role = USER_ROLES.USER;
      const createUser = await User.create(payload);
      if (!createUser) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
      }
      return createUser
};




export const UserService = {
      createUserToDB,

};
