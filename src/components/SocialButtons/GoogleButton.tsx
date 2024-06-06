"use client";

import SvgGoogle from "../svg/SvgGoogle";

const GoogleButton = () => {
  return (
    <button className="inline-flex gap-3 items-center border border-skin rounded-md px-3 py-2 text-skin-muted">
      <SvgGoogle /> google
    </button>
  );
};

export default GoogleButton;
