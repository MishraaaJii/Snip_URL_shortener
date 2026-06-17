import mongoose from "mongoose"

const urlSchema = new mongoose.Schema({
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    originalUrl: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Url = mongoose.model("Url", urlSchema);
export default Url;