"use client";

import Button from "@/components/core/Button";
import CheckboxWithLabel from "@/components/core/CheckboxWithLabel";
import TextInput from "@/components/core/TextInput";
import { actionRegister } from "@/lib/next-safe-action/actionRegisterUser";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";

const FormRegister = () => {
  const [isShow, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState({
    general: "",
    name: "",
    email: "",
    password: "",
    username: "",
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const { execute, isExecuting } = useAction(actionRegister, {
    onSuccess: () => {
      formRef.current?.reset();
      setMessage("Registration is successful");
    },
    onError: ({ error: { serverError, validationErrors } }) => {
      if (serverError) {
        setError({
          ...error,
          general: serverError,
        });
      }
      if (validationErrors) {
        const { email, name, password, username } = validationErrors;
        setError({
          ...error,
          email: email ? email[0] : "",
          name: name ? name[0] : "",
          password: password ? password[0] : "",
          username: username ? username[0] : "",
        });
      }
    },
  });

  return (
    <form ref={formRef} className="space-y-3" action={execute}>
      <section className="text-center text-sm">
        <p className={cn(message && "text-green-500", error && "text-red-500")}>
          {error.general}
          {message}
        </p>
      </section>
      <fieldset className="space-y-3" disabled={isExecuting}>
        <TextInput
          errorMessage={error.name}
          label="Name"
          name="name"
          id="name"
        />
        <TextInput
          errorMessage={error.email}
          label="Email"
          name="email"
          id="email"
        />
        <TextInput
          errorMessage={error.username}
          label="Username"
          name="username"
          id="username"
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
