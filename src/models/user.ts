import { db } from "../db.js";

export const getPasswordHashFromUsername = (
  username: string
): { password: string; token: string } | undefined => {
  const results = db
    .query(
      `SELECT password, token FROM users WHERE username = $username LIMIT 1`
    )
    .get({
      $username: username,
    });
  return results;
};

export const getUserIDFromToken = (token: string): number | undefined => {
  const results = db
    .query(`SELECT id FROM users WHERE token = $token LIMIT 1`)
    .get({
      $token: token,
    });
  return results.id;
};

const createUserStatement = db.prepare(`
INSERT INTO users (
  username,
  password,
  email,
  token
) VALUES (
  $username,
  $password,
  $email,
  $token
);`);

export const createUser = db.transaction(
  (
    username: string,
    passwordHash: string,
    email: string | null,
    token: string
  ) =>
    createUserStatement.run({
      $username: username,
      $password: passwordHash,
      $email: email,
      $token: token,
    })
);

const updateTokenStatement = db.prepare(
  `UPDATE users set token = $token WHERE id = $id`
);

export const updateToken = db.transaction((id: number, token: string) =>
  updateTokenStatement.run({
    $id: id,
    $token: token,
  })
);
