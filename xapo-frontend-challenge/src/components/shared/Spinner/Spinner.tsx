import React from "react";
import "./Spinner.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "blue" | "white";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "blue",
  className = "",
}) => {
  const sizeClass =
    size === "small"
      ? "spinner--small"
      : size === "large"
      ? "spinner--large"
      : "";
  const colorClass = color === "white" ? "spinner--white" : "";

  return (
    <div
      className={`spinner ${sizeClass} ${colorClass} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className="spinner__circle" />
    </div>
  );
};
