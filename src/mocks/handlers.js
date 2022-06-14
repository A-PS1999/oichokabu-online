import { rest } from "msw";
import { serverAddress } from "../settings";

export const handlers = [
    rest.post(`${serverAddress}/api/log-in`, (req, res, ctx) => {
        const user = {
            id: 1,
            username: "test_user",
            user_chips: 8100
        }
        return res(
            ctx.json({ user })
        )
    }),
    rest.post(`${serverAddress}/api/register`, (req, res, ctx) => {
        const user = req.body;
        return res (
            ctx.json({ user })
        )
    }),
    rest.post(`${serverAddress}/api/get-session`, (req, res, ctx) => {
        const result = { sid: "exists" }
        return res(
            ctx.json({ result })
        )
    }),
    rest.post(`${serverAddress}/api/log-out`, (req, res, ctx) => {
        return res(
            ctx.status(200),
        )
    })
]