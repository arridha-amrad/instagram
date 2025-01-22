"use client";

import Button from "@/components/core/Button";
import TextInput from "@/components/core/TextInput";
import { useAction } from "next-safe-action/hooks";
import { ChangeEvent, useState } from "react";
import { resetPassword } from "./action";
import { useSearchParams } from "next/navigation";

const Form = () => {
  const params = useSearchParams();
  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const { execute, isPending, result } = useAction(
    resetPassword.bind(null, params.get("token")),
  );

  const passwordError = result.validationErrors?.password?._errors;
  const confirmPasswordError =
    result.validationErrors?.confirmPassword?._errors;
  const actionError = result.serverError;

  return (
    <form className="space-y-3" action={execute}>
      <section className="text-center text-sm">
        {actionError && <p className="text-red-500">{actionError}</p>}
      </section>
      <fieldset className="space-y-3" disabled={isPending}>
        <TextInput
          onChange={handleChange}
          value={state.password}
          errorMessage={passwordError && passwordError[0]}
          label="Password"
          name="password"
          id="password"
          type="password"
        />
        <TextInput
          onChange={handleChange}
          value={state.confirmPassword}
          errorMessage={confirmPasswordError && confirmPasswordError[0]}
          label="Confirm Password"
          name="confirmPassword"
          id="confirmPassword"
          type="password"
        />
        <Button
          isLoading={isPending}
          className="inline-flex w-full justify-center"
          type="submit"
        >
          Submit
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
