// models/Comment.js

// Copied the format and layout from Post.js to implement a new Comment Schema

import mongoose, { mongo } from "mongoose";

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    body: {
        type: String,
        required: true, 
        minlength: 1, 
        maxlength: 500
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;