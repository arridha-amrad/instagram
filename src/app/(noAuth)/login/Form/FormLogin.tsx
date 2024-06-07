"use client";

import TextInput from "@/components/core/TextInput";
import ButtonSubmitLogin from "./ButtonSubmitLogin";
import CheckboxWithLabel from "@/components/core/CheckboxWithLabel";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { loginAction } from "./actionLogin";
import { cn } from "@/lib/utils";

const initialState = {
  errors: {} as any,
  type: "",
  message: "",
};

const FormLogin = () => {
  const [isShow, setShow] = useState(false);
  const [formState, formAction] = useFormState(loginAction, initialState);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (formState.type === "success") {
      formRef.current?.reset();
    }
  }, [formState.type]);

  return (
    <form ref={formRef} className="space-y-3" action={formAction}>
      <section className="text-sm">
        <p
          className={cn(
            formState.type === "success" ? "text-green-500" : "text-red-500"
          )}
        >
          {formState.message}
        </p>
      </section>
      <TextInput
        errorMessage={
          formState.errors?.identity && formState.errors.identity[0]
        }
        label="Username or email"
        name="identity"
        id="identity"
      />
      <TextInput
        errorMessage={
          formState.errors?.password && formState.errors.password[0]
        }
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
      <ButtonSubmitLogin />
    </form>
  );
};

export default FormLogin;
