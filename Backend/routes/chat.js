import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js"

const router = express.Router();

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing new thread2"
        });

        const response = await thread.save();
        res.send(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});

// Get all threads 
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAT: -1 });
        //descending order of updatedAt.. most recent data on top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: "Failed to save in DB" });
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            res.status(404).json({ error: "Thread not found" })
        }
        res.json(thread.messages);

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: "Failed to fetch chat" });
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ succes: "Thread deleted successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: "Failed to delete threads" });
    }
});

router.post("/chat", async (req, res) => {

    console.log(req.body);
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        res.status(400).json({ error: "missing required fields" });

    }
    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            //create a new thread in DB
            {
                thread = new Thread({
                    threadId,
                    title: message,
                    messages: [{ role: "user", content: message }]
                })
            };
        } else {
            thread.messages.push({ role: "user", content: message })
        }

        const assistantReply = await getOpenAIAPIResponse(message);
        console.log("Assistant reply:", assistantReply);
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "somthing went wrong" })
    }
});

export default router;