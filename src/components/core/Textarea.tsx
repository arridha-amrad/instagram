"use client";

import { HTMLAttributes, TextareaHTMLAttributes } from "react";

type Props = {
  label: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({ label, ...props }: Props) => {
  return (
    <textarea
      name="asf"
      {...props}
      id={props.id}
      placeholder="how you describe this post?"
      className="mt-2 w-full resize-none bg-skin-input focus:ring focus:ring-skin-primary focus:border-transparent rounded-lg border-transparent align-top shadow-sm sm:text-sm"
      rows={5}
    ></textarea>
  );
};

export default Textarea;
