import { auth } from "@/auth";
import { cache } from "react";

export const getAuth = cache(auth);
