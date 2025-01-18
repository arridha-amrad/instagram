import { type ClassValue, clsx } from "clsx";
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
