import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";
import { type ClassValue, clsx } from "clsx";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showToast = (message: string, variant: "success" | "error") => {
  const theme = localStorage.getItem("theme") ?? "light";
  if (variant === "error") {
    return toast.error(message, { theme });
  }
  return toast.success(message, { theme });
};

export function generateRandomOTP(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const code = encodeBase32UpperCaseNoPadding(bytes);
  return code;
}

export const getEmailVerificationRequestCookie = async (
  cookie: ReadonlyRequestCookies,
) => {
  const data = cookie.get("email_verification")?.value;
  return data;
};

export async function setEmailVerificationRequestCookie(
  id: string,
  expiresAt: Date,
  cookie: ReadonlyRequestCookies,
) {
  cookie.set("email_verification", id, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
  });
}

export async function deleteEmailVerificationRequestCookie(
  cookie: ReadonlyRequestCookies,
) {
  cookie.set("email_verification", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}
