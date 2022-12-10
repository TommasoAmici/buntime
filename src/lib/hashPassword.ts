// https://github.com/oven-sh/bun/issues/883#issuecomment-1218881235
import { promisify } from "util";
// Note: Cannot name this import "crypto" as that seems to always be a reserved global...
import nodeCrypto from "crypto";

const pbkdf2 = promisify(nodeCrypto.pbkdf2);
const randomBytes = promisify(nodeCrypto.randomBytes);
const iterations = 10000;
const keyLen = 128;
const digest = "sha512";

const hashToString = (salt: Buffer, hash: Buffer) =>
  `${salt.toString("hex")}:${hash.toString("hex")}`;

export async function hashPassword(password: string) {
  const salt = await randomBytes(16);
  const result = await pbkdf2(password, salt, iterations, keyLen, digest);
  return hashToString(salt, result);
}

export async function verifyPassword(password: string, hashed: string) {
  const [saltStr] = hashed.split(":", 1);
  const salt = Buffer.from(saltStr, "hex");
  const calculated = await pbkdf2(password, salt, iterations, keyLen, digest);
  return hashToString(salt, calculated) === hashed;
}
