import { timeStamp } from "console";
import mongoose from "mongoose";
import { threadId } from "worker_threads";

const MesssageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "system", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: "New chat",
    },
    messages: [MesssageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    update: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Thread ", ThreadSchema);