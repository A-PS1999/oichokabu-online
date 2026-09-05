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
    })
]