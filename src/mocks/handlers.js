import { http, HttpResponse } from "msw";
import { serverAddress } from "../settings";

export const handlers = [
    http.post(`${serverAddress}/api/log-in`, async () => {
        return HttpResponse.json({
            user: { id: 1, username: "test_user", user_chips: 8100 }
        })
    }),
    http.post(`${serverAddress}/api/register`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ auth: {}, user: body })
    }),
    http.post(`${serverAddress}/api/get-session`, async () => {
        return HttpResponse.json({ authenticated: true })
    }),
    http.post(`${serverAddress}/api/log-out`, async () => {
        return HttpResponse.json({})
    }),
    http.get(`${serverAddress}/api/get-user-id`, async () => {
        return HttpResponse.json({ id: 1 })
    }),
    http.get(`${serverAddress}/api/lobby/user-chips`, async () => {
        return HttpResponse.json(8100)
    }),
    http.get(`${serverAddress}/api/lobby/lobbies`, async () => {
        return HttpResponse.json([])
    })
]