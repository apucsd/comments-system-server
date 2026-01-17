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
exports.CommentService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const comment_model_1 = require("./comment.model");
const createCommentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.create(payload);
    return result;
});
const getAllCommentsFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const commentQuery = new QueryBuilder_1.default(comment_model_1.Comment.find()
        .populate('author', 'name email profile')
        .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name email profile' },
    }), query)
        .search(['content'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield commentQuery.countTotal();
    const data = yield commentQuery.modelQuery;
    const formattedData = data.map((comment) => {
        var _a;
        const commentObj = comment.toObject();
        const isLiked = userId ? commentObj.likes.some((id) => id.toString() === userId) : false;
        const isDisliked = userId ? commentObj.dislikes.some((id) => id.toString() === userId) : false;
        const replies = (_a = commentObj.replies) === null || _a === void 0 ? void 0 : _a.map((reply) => {
            var _a, _b;
            return Object.assign(Object.assign({}, reply), { isLiked: userId ? (_a = reply.likes) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === userId) : false, isDisliked: userId ? (_b = reply.dislikes) === null || _b === void 0 ? void 0 : _b.some((id) => id.toString() === userId) : false });
        });
        return Object.assign(Object.assign({}, commentObj), { isLiked,
            isDisliked,
            replies });
    });
    return {
        meta,
        data: formattedData,
    };
});
const replyCommentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(id);
    if (!comment) {
        throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, 'Comment not found');
    }
    const reply = yield comment_model_1.Comment.create(Object.assign({}, payload));
    yield comment_model_1.Comment.findByIdAndUpdate(id, {
        $push: { replies: reply._id },
    });
    return reply;
});
const likeCommentInDB = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(id);
    if (!comment) {
        throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, 'Comment not found');
    }
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const isLiked = comment.likes.some((like) => like.equals(userObjectId));
    const isDisliked = comment.dislikes.some((dislike) => dislike.equals(userObjectId));
    let updateQuery = {};
    if (isLiked) {
        updateQuery = {
            $pull: { likes: userObjectId },
            $inc: { likeCount: -1 },
        };
    }
    else {
        if (isDisliked) {
            updateQuery = {
                $pull: { dislikes: userObjectId },
                $addToSet: { likes: userObjectId },
                $inc: { dislikeCount: -1, likeCount: 1 },
            };
        }
        else {
            updateQuery = {
                $addToSet: { likes: userObjectId },
                $inc: { likeCount: 1 },
            };
        }
    }
    const result = yield comment_model_1.Comment.findByIdAndUpdate(id, updateQuery, {
        new: true,
    });
    return result;
});
const dislikeCommentInDB = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(id);
    if (!comment) {
        throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, 'Comment not found');
    }
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const isLiked = comment.likes.some((like) => like.equals(userObjectId));
    const isDisliked = comment.dislikes.some((dislike) => dislike.equals(userObjectId));
    let updateQuery = {};
    if (isDisliked) {
        updateQuery = {
            $pull: { dislikes: userObjectId },
            $inc: { dislikeCount: -1 },
        };
    }
    else {
        if (isLiked) {
            updateQuery = {
                $pull: { likes: userObjectId },
                $addToSet: { dislikes: userObjectId },
                $inc: { likeCount: -1, dislikeCount: 1 },
            };
        }
        else {
            updateQuery = {
                $addToSet: { dislikes: userObjectId },
                $inc: { dislikeCount: 1 },
            };
        }
    }
    const result = yield comment_model_1.Comment.findByIdAndUpdate(id, updateQuery, {
        new: true,
    });
    return result;
});
const updateCommentInDB = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(id);
    if (!comment) {
        throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, 'Comment not found');
    }
    if (comment.author.toString() !== userId) {
        throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not authorized');
    }
    const result = yield comment_model_1.Comment.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteCommentFromDB = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(id);
    if (!comment) {
        throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, 'Comment not found');
    }
    if (comment.author.toString() !== userId) {
        throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not authorized');
    }
    const result = yield comment_model_1.Comment.findByIdAndDelete(id);
    return result;
});
exports.CommentService = {
    createCommentIntoDB,
    getAllCommentsFromDB,
    replyCommentIntoDB,
    likeCommentInDB,
    dislikeCommentInDB,
    updateCommentInDB,
    deleteCommentFromDB,
};
