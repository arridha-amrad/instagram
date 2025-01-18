"use client";

import Button from "@/components/core/Button";
import CheckboxWithLabel from "@/components/core/CheckboxWithLabel";
import TextInput from "@/components/core/TextInput";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { login } from "./action";

const FormLogin = () => {
  const [isShow, setShow] = useState(false);

  const [state, setState] = useState({
    identity: "",
    password: "",
  });

  const params = useSearchParams();

  const { execute, isPending, result } = useAction(
    login.bind(null, params.get("cb_url")),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const identityError = result.validationErrors?.identity?._errors;
  const passwordError = result.validationErrors?.password?._errors;
  const actionError = result.serverError;

  return (
    <form className="space-y-3" action={execute}>
      <section className="text-center text-sm">
        {actionError && <p className="text-red-500">{actionError}</p>}
      </section>
      <fieldset className="space-y-3" disabled={isPending}>
        <TextInput
          errorMessage={identityError && identityError[0]}
          onChange={handleChange}
          value={state.identity}
          label="Username or email"
          name="identity"
          id="identity"
        />
        <TextInput
          errorMessage={passwordError && passwordError[0]}
          onChange={handleChange}
          value={state.password}
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
          isLoading={isPending}
          type="submit"
        >
          Sign In
        </Button>
      </fieldset>
    </form>
  );
};

export default FormLogin;
