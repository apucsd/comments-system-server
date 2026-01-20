import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModal } from './user.interface';

const userSchema = new Schema<IUser, UserModal>(
      {
            name: {
                  type: String,
            },

            role: {
                  type: String,
                  enum: Object.values(USER_ROLES),
                  required: true,
            },
            email: {
                  type: String,
                  required: true,
                  unique: true,
                  lowercase: true,
            },

            contact: {
                  type: String,
            },
            password: {
                  type: String,
                  required: true,
                  select: 0,
            },
            location: {
                  type: String,
            },
            profile: {
                  type: String,
                  default: 'https://i.ibb.co/z5YHLV9/profile.png',
            },
            status: {
                  type: String,
                  enum: ['active', 'delete'],
                  default: 'active',
            },
      },
      { timestamps: true }
);

//is match password
userSchema.statics.isMatchPassword = async (password: string, hashPassword: string): Promise<boolean> => {
      return await bcrypt.compare(password, hashPassword);
};

//check user
userSchema.pre('save', async function (next) {
      this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
      next();
});

export const User = model<IUser, UserModal>('User', userSchema);
