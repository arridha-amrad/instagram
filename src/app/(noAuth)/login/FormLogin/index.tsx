"use client";

import Button from "@/components/core/Button";
import CheckboxWithLabel from "@/components/core/CheckboxWithLabel";
import TextInput from "@/components/core/TextInput";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { loginAction } from "./actionLogin";

const FormLogin = () => {
  const [isShow, setShow] = useState(false);
  const params = useSearchParams();
  const la = loginAction.bind(null, params.get("cbUrl"));
  const { execute, isExecuting, result } = useAction(la);
  const identityError = result.validationErrors?.identity;
  const passwordError = result.validationErrors?.password;

  return (
    <form className="space-y-3" action={execute}>
      <section className="text-center text-sm">
        <p className="text-red-500">
          {result.data?.err}
          {result.serverError}
        </p>
      </section>
      <fieldset className="space-y-3" disabled={isExecuting}>
        <TextInput
          errorMessage={identityError && identityError[0]}
          label="Username or email"
          name="identity"
          id="identity"
        />
        <TextInput
          errorMessage={passwordError && passwordError[0]}
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
