"use client";

import TextInput from "@/components/core/TextInput";
import ButtonSubmitRegister from "./ButtonSubmitRegister";
import CheckboxWithLabel from "@/components/core/CheckboxWithLabel";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { registerAction } from "./actionRegister";
import { cn } from "@/lib/utils";

const initialState = {
  errors: {} as any,
  type: "",
  message: "",
};

const FormRegister = () => {
  const [isShow, setShow] = useState(false);
  const [formState, formAction] = useFormState(registerAction, initialState);
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
        errorMessage={formState.errors?.name && formState.errors.name[0]}
        label="Name"
        name="name"
        id="name"
      />
      <TextInput
        errorMessage={formState.errors?.email && formState.errors.email[0]}
        label="Email"
        name="email"
        id="email"
      />
      <TextInput
        errorMessage={
          formState.errors?.username && formState.errors.username[0]
        }
        label="Username"
        name="username"
        id="username"
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
      <ButtonSubmitRegister />
    </form>
  );
};

export default FormRegister;
