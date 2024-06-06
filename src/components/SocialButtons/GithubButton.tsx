"use client";

import SvgGithub from "../svg/SvgGithub";

const GithubButton = () => {
  return (
    <button className="inline-flex gap-3 items-center border border-skin rounded-md px-3 py-2 text-skin-muted">
      <SvgGithub />
      github
    </button>
  );
};

export default GithubButton;
