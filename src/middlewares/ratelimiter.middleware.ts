import type { Request, Response, NextFunction } from "express"
import crypto from "crypto"
import redisclient from "../config/redis.js"


export const Ratelimiter = async (req: Request, res: Response, next: NextFunction) => {



    try {
        const WINDOW = 60 * 60 * 1000;
        const limit = 15;

        const now = Date.now();
        const WINDOW_Start = now - WINDOW

        const ip = req.ip;
        const key = `Ratelimit:${ip}`
        const uniquevalue = `${ip}:${crypto.randomUUID()}`


        await redisclient.zRemRangeByScore(key, 0, WINDOW_Start);

        const count = await redisclient.zCard(key);

        if (count > limit) {
            return res.status(429).send({
                message: "Too many requests",
            })
        }

        await redisclient.zAdd(key, {
            score: now,
            value: uniquevalue,
        });

        await redisclient.expire(key, Math.floor(WINDOW / 1000));

        next();

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({
                message: "Internal Server Error",
            })
        }
    }

}