import express from "express"
import Url from "../models/Url.js"
import Counter from "../models/Counter.js"

const router = express.Router();

const Base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function toBase62(num){
    let result = "";
    while(num > 0){
        result = Base62[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result;
}

router.post("/api/shorten", async(req, res) => {
    const { originalUrl } = req.body;
    const counter = await Counter.findOneAndUpdate(
        { _id: "url_counter" },
        { $inc: {value: 1} },
        {new: true, upsert: true}
    );

    const shortCode = toBase62(counter.value);

    const url = new Url({shortCode, originalUrl});
    await url.save();

    res.json({ shortCode });
});

router.get("/:code", async(req, res) => {
    const code = req.params.code;
    const doc = await Url.findOne({shortCode: code});

    if(doc) {
        const longUrl = doc.originalUrl;
        res.redirect(301, longUrl);
    } else {
        res.status(404).json({error: "URL not found"});
    }
});

export default router;