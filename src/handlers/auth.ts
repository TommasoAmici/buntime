import { hashPassword, verifyPassword } from "../lib/hashPassword.js";
import { generateToken, tokenFromBasicAuth } from "../lib/token.js";
import {
  createUser,
  getPasswordHashFromUsername,
  getUserIDFromToken,
  updateToken,
} from "../models/user.js";

export async function postSignup(req: Request) {
  const { username, password, email } = await req.json<User>();
  const passwordHash = await hashPassword(password);
  const token = generateToken();
  try {
    createUser(username, passwordHash, email ?? null, token);
  } catch (error) {
    return new Response("", { status: 409 });
  }
  return new Response("", { status: 201 });
}

export async function postLogin(req: Request) {
  const { username, password } = await req.json<User>();
  const results = getPasswordHashFromUsername(username);
  if (results === undefined) {
    return new Response("Unauthorized access", { status: 401 });
  }

  const { password: passwordHash, token } = results;

  const verified = await verifyPassword(password, passwordHash);
  if (!verified) {
    return new Response("Unauthorized access", { status: 401 });
  }

  return new Response(JSON.stringify({ token }), { status: 200 });
}

export async function postGenerateToken(_req: Request, userID: number) {
  const token = generateToken();
  updateToken(userID, token);
  const response = { token };
  return new Response(JSON.stringify(response), { status: 200 });
}

export function authenticatedMiddleware(
  req: Request,
  handler: (r: Request, u: number) => Promise<Response>
) {
  const auth = req.headers.get("Authorization");
  if (auth === null) {
    return new Response(
      JSON.stringify({ msg: "Authorization token missing" }),
      { status: 401 }
    );
  }

  const token = tokenFromBasicAuth(auth);
  const userID = getUserIDFromToken(token);
  if (userID === undefined) {
    return new Response(
      JSON.stringify({ msg: "Failed to authenticate request" }),
      { status: 401 }
    );
  }

  return handler(req, userID);
}
