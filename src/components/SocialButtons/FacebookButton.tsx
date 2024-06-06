"use client";

import SvgFacebook from "../svg/SvgFacebook";

const FacebookButton = () => {
  return (
    <button className="inline-flex gap-3 items-center border border-skin rounded-md px-3 py-2 text-skin-muted">
      <SvgFacebook /> facebook
    </button>
  );
};

export default FacebookButton;
