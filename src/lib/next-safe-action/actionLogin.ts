"use server";

import { signIn } from "@/auth";
import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { login } from "../drizzle/mutations/login";
import { actionClient } from "./init";

const loginSchema = zfd.formData({
  identity: zfd.text(z.string()),
  password: zfd.text(z.string()),
});

export const actionLogin = actionClient
  .schema(loginSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[cbUrl: z.ZodString | z.ZodNullable<z.ZodString>]>([
    z.string().nullable(),
  ])
  .action(
    async ({
      parsedInput: { identity, password },
      bindArgsParsedInputs: [cbUrl],
    }) => {
      try {
        const user = await login({ identity, password });
        await signIn("credentials", {
          ...user,
          redirectTo: cbUrl ? cbUrl : "/",
        });
      } catch (err) {
        throw err;
      }
    },
  );
