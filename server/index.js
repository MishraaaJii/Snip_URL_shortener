import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import urlRoutes from "./routes/url.js"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const mongoDB_uri = process.env.MONGODB_URI;
const port = process.env.PORT;

async function main(){
    await mongoose.connect(mongoDB_uri);
    console.log("Connected to MongoDB successfully.");
    app.use("/", urlRoutes);
    app.listen(port, () =>{
        console.log(`Server running on port ${port}`);
    });
}

main();

