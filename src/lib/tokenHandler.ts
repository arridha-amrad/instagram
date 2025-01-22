import config from "@/config.env";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(config.TOKEN_SECRET_KEY);

export async function createTokenForResetPassword(
  code: string,
  userId: string,
) {
  const token = await new SignJWT({ userId, code })
    .setIssuedAt()
    .setExpirationTime("1h")
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
  return token;
}

export async function verifyTokenForResetPassword(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
