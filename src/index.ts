import {
  authenticatedMiddleware,
  postGenerateToken,
  postLogin,
  postSignup,
} from "./handlers/auth.js";
import { postHeartbeats } from "./handlers/heartbeats.js";
import { getStatusbar } from "./handlers/statusbar.js";

Bun.serve({
  async fetch(req: Request) {
    const { pathname } = new URL(req.url);
    console.log(`${req.method}\t${pathname}`);

    switch (req.method) {
      case "GET":
        switch (pathname) {
          case "/api/v1/users/current/statusbar/today":
            return authenticatedMiddleware(req, getStatusbar);
        }

      case "POST":
        switch (pathname) {
          case "/api/v1/users/current/heartbeats.bulk":
            return authenticatedMiddleware(req, postHeartbeats);
          case "/api/v1/plugins/errors":
            // returns a 200 but doesn't store the errors
            return new Response("", { status: 201 });
          case "/api/v1/users/signup":
            return postSignup(req);
          case "/api/v1/users/login":
            return postLogin(req);
          case "/api/v1/users/token/generate":
            return authenticatedMiddleware(req, postGenerateToken);
        }
      default:
        return new Response("Not found", { status: 404 });
    }
  },
  port: process.env.PORT ?? 3000,
});
