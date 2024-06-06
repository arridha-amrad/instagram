"use client";

import { useEffect, useState } from "react";
import Switch from "./core/Switch";
import { useTheme } from "next-themes";

const SwitchTheme = () => {
  const [isDark, setDark] = useState(false);
  const { setTheme, theme } = useTheme();
  useEffect(() => {
    setDark(theme === "dark");
  }, [theme]);
  return (
    <Switch
      checked={isDark}
      onChange={() => setTheme(() => (isDark ? "light" : "dark"))}
    />
  );
};

export default SwitchTheme;
