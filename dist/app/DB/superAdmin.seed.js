"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../enums/user");
const logger_1 = require("../../shared/logger");
const user_model_1 = require("../modules/user/user.model");
const colors_1 = __importDefault(require("colors"));
const superAdmin = {
    name: 'Super Admin',
    userName: 'supper_admin',
    role: user_1.USER_ROLES.SUPER_ADMIN,
    email: 'apucsd.dev@gmail.com',
    password: 'superadmin',
    profile: 'https://i.ibb.co/z5YHLV9/profile.png',
    status: 'active',
    verified: true,
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const isExistSuperAdmin = yield user_model_1.User.findOne({ role: user_1.USER_ROLES.SUPER_ADMIN });
    if (!isExistSuperAdmin) {
        yield user_model_1.User.create(superAdmin);
        logger_1.logger.info(colors_1.default.yellow(`[🅰️ SEED] Super Admin user created`));
    }
});
exports.default = seedSuperAdmin;
