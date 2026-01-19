import express from "express";
import "dotenv/config";
import cors from "cors";

import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = 8080;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log(`Mongoose readyState: ${mongoose.connection.readyState} (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)`);
    next();
});

app.use("/auth", authRoutes);
app.use("/api", chatRoutes);


// app.use(session());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         emial: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser)
// })

const connectDB = async () => {
    try {
        // Enable mongoose debug mode to see what it's doing
        mongoose.set("debug", true);

        mongoose.connection.on('connected', () => console.log("Mongoose connected to DB"));
        mongoose.connection.on('error', (err) => console.log("Mongoose connection error:", err));
        mongoose.connection.on('disconnected', () => console.log("Mongoose disconnected"));

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");

        // Immediate verify: Try to list collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Verified! Available collections:", collections.map(c => c.name));

    } catch (err) {
        console.log("Failed to connect with DB", err);
        process.exit(1);
    }
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on ${PORT}`);
    });
});



// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: req.body.message,
//             }]
//         })
//     };

//     try {
//         const respons = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await respons.json();
//         console.log(data.choices[0].message.content);
//         res.send(data.choices[0].message.content);

//     } catch (err) {
//         console.log(err);
//     }
// })


