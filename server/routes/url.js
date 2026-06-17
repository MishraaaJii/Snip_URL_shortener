import express from "express"
import Url from "../models/Url.js"
import Counter from "../models/Counter.js"

const router = express.Router();

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ";

function seededRandom(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;
    return ((a * seed + c) % m);
}

function generateCode(counter){
    const randomNum = seededRandom(counter);
    let result = "";
    let num = randomNum;
    while(num > 0){
        result = BASE62[num % 62] + result;
        num = Math.floor(num/62);
    }
    return result.slice(0, 5).padStart(5, '0');
}

router.post("/api/shorten", async(req, res) => {
    const { originalUrl } = req.body;
    let shortCode;
    let saved = false;
    while(!saved){
        const counter = await Counter.findOneAndUpdate(
            { _id: "url_counter" },
            { $inc: {value: 1} },
            {returnDocument: 'after', upsert: true}
        );
        shortCode = generateCode(counter.value);

        try{
            const url = new Url({shortCode, originalUrl});
            await url.save();
            saved = true;
        } catch (err) {
            if(err.code === 11000){
                continue;
            }
            throw err;
        }

    }

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