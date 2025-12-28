import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export default function generateJWT(payload: object): string {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN ?? "30d";

  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
}
