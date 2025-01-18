"use client";

import Button from "@/components/core/Button";
import CheckboxWithLabel from "@/components/core/CheckboxWithLabel";
import TextInput from "@/components/core/TextInput";
import { useAction } from "next-safe-action/hooks";
import { ChangeEvent, useRef, useState } from "react";
import { signUp } from "./action";

const FormRegister = () => {
  const [isShow, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const [state, setState] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const formRef = useRef<HTMLFormElement | null>(null);

  const { execute, isExecuting, result } = useAction(signUp, {
    onSuccess: () => {
      formRef.current?.reset();
      setMessage("Registration is successful");
      setState({
        email: "",
        name: "",
        password: "",
        username: "",
      });
    },
  });

  const nameError = result.validationErrors?.name?._errors;
  const usernameError = result.validationErrors?.username?._errors;
  const emailError = result.validationErrors?.email?._errors;
  const passwordError = result.validationErrors?.password?._errors;
  const actionError = result.serverError;

  return (
    <form ref={formRef} className="space-y-3" action={execute}>
      <section className="text-center text-sm">
        {actionError && <p className="text-red-500">{actionError}</p>}
        {message && <p className="text-green-500">{message}</p>}
      </section>
      <fieldset className="space-y-3" disabled={isExecuting}>
        <TextInput
          onChange={handleChange}
          value={state.name}
          errorMessage={nameError && nameError[0]}
          label="Name"
          name="name"
          id="name"
        />
        <TextInput
          onChange={handleChange}
          value={state.email}
          errorMessage={emailError && emailError[0]}
          label="Email"
          name="email"
          id="email"
        />
        <TextInput
          onChange={handleChange}
          value={state.username}
          errorMessage={usernameError && usernameError[0]}
          label="Username"
          name="username"
          id="username"
        />

        <TextInput
          onChange={handleChange}
          value={state.password}
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
