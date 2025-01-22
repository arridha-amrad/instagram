"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { forgotPassword } from "./action";

const Form = () => {
  const [state, setState] = useState("");
  const { execute, isPending, result } = useAction(forgotPassword);
  const emailError = result.validationErrors?.email?._errors;
  const actionError = result.serverError;
  const message = result.data;
  return (
    <form className="space-y-3" action={execute}>
      <section className="text-center text-sm">
        {actionError && <p className="text-red-500">{actionError}</p>}
        {message && <p className="text-green-500">{message}</p>}
      </section>
      <fieldset className="space-y-3" disabled={isPending}>
        <TextInput
          onChange={(e) => setState(e.target.value)}
          value={state}
          errorMessage={emailError && emailError[0]}
          label="Email"
          name="email"
          id="email"
        />
        <Button
          isLoading={isPending}
          className="inline-flex w-full justify-center"
          type="submit"
        >
          Send
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
