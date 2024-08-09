"use client";

import Button from "@/components/core/Button";
import CheckboxWithLabel from "@/components/core/CheckboxWithLabel";
import TextInput from "@/components/core/TextInput";
import { actionLogin } from "@/lib/next-safe-action/actionLogin";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const FormLogin = () => {
  const [isShow, setShow] = useState(false);
  const [error, setError] = useState({
    general: "",
    identity: "",
    password: "",
  });
  const params = useSearchParams();
  const la = actionLogin.bind(null, params.get("cbUrl"));
  const { execute, isExecuting, result } = useAction(la, {
    onError: ({ error: { serverError, validationErrors } }) => {
      if (serverError) {
        setError({
          ...error,
          general: serverError,
        });
      }
      if (validationErrors) {
        const { identity, password } = validationErrors;
        setError({
          ...error,
          identity: identity ? identity[0] : "",
          password: password ? password[0] : "",
        });
      }
    },
  });

  return (
    <form className="space-y-3" action={execute}>
      <section className="text-center text-sm">
        <p className="text-red-500">{error.general}</p>
      </section>
      <fieldset className="space-y-3" disabled={isExecuting}>
        <TextInput
          errorMessage={error.identity}
          label="Username or email"
          name="identity"
          id="identity"
        />
        <TextInput
          errorMessage={error.password}
          label="Password"
          type={isShow ? "text" : "password"}
          name="password"
        />
        <CheckboxWithLabel
          checked={isShow}
          onChange={() => setShow((val) => !val)}
          label="Show password"
        />
        <div className="h-4" />
        <Button
          className="inline-flex w-full justify-center"
          isLoading={isExecuting}
          type="submit"
        >
          Sign In
        </Button>
      </fieldset>
    </form>
  );
};

export default FormLogin;
