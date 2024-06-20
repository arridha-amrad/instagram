"use client";

import { SVGAttributes } from "react";

const SvgMale = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      height="24"
      viewBox="0 0 512 512"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title />
      <path d="M442,48H352a22,22,0,0,0,0,44h36.89L328.5,152.39c-68.19-52.86-167-48-229.54,14.57h0C31.12,234.81,31.12,345.19,99,413A174.21,174.21,0,0,0,345,413c62.57-62.58,67.43-161.35,14.57-229.54L420,123.11V160a22,22,0,0,0,44,0V70A22,22,0,0,0,442,48ZM313.92,381.92a130.13,130.13,0,0,1-183.84,0c-50.69-50.68-50.69-133.16,0-183.84s133.16-50.69,183.84,0S364.61,331.24,313.92,381.92Z" />
    </svg>
  );
};

export default SvgMale;
