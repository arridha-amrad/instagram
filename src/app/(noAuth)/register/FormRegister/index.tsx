"use client";

import Button from "@/components/core/Button";
import CheckboxWithLabel from "@/components/core/CheckboxWithLabel";
import TextInput from "@/components/core/TextInput";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import { registerAction } from "./action-register";

const FormRegister = () => {
  const [isShow, setShow] = useState(false);
  const { execute, hasErrored, hasSucceeded, isExecuting, result } =
    useAction(registerAction);
  const nameError = result.validationErrors?.name;
  const emailError = result.validationErrors?.email;
  const passwordError = result.validationErrors?.password;
  const usernameError = result.validationErrors?.username;
  const formRef = useRef<HTMLFormElement | null>(null);

  const error = result.data?.err;
  const message = result.data?.message;

  useEffect(() => {
    if (message) {
      formRef.current?.reset();
    }
  }, [message]);

  return (
    <form ref={formRef} className="space-y-3" action={execute}>
      <section className="text-center text-sm">
        <p className={cn(message && "text-green-500", error && "text-red-500")}>
          {error}
          {message}
        </p>
      </section>
      <fieldset className="space-y-3" disabled={isExecuting}>
        <TextInput
          errorMessage={nameError && nameError[0]}
          label="Name"
          name="name"
          id="name"
        />
        <TextInput
          errorMessage={emailError && emailError[0]}
          label="Email"
          name="email"
          id="email"
        />
        <TextInput
          errorMessage={usernameError && usernameError[0]}
          label="Username"
          name="username"
          id="username"
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
          isLoading={isExecuting}
          className="inline-flex w-full justify-center"
          type="submit"
        >
          Register
        </Button>
      </fieldset>
    </form>
  );
};

export default FormRegister;
