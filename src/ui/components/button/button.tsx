import clsx from "clsx";
import React from "react";
import "./button.css";

interface ButtonProps {
  text: string;
  disabled: boolean;
  onClick: () => void;
}

export function Button({ text, disabled, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx("button", disabled && "button__disabled")}
    >
      {text}
    </button>
  );
}
