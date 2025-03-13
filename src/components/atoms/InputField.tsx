import React from "react";
import { cn } from "../../utils/tailwindMerge";

type InputFieldProps = {
  label: string;
  type?: string;
  error?: boolean | string;
  helperText?: string;
  flexDir?: "row" | "col";
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  flexDir = "col",
  helperText,
  error = false,
  value,
  onChange,
  className,
  ...restProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex",
          flexDir === "col"
            ? "flex-col"
            : "flex-row items-center justify-between"
        )}
      >
        <label className="text-sm">{label}</label>
        <input
          type={type}
          value={value}
          onChange={handleChange}
          className={cn(
            "border rounded-lg p-2 mt-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48",
            error ? "border-red-500 " : "border-gray-400 ",
            className
          )}
          {...restProps}
        />
      </div>
      <div className="flex flex-col w-full ">
        {error && typeof error === "string" && (
          <p className="text-red-500 text-sm ">{error}</p>
        )}
        {helperText && (
          <p className="text-gray-500 text-xs mt-1 ">{helperText}</p>
        )}
      </div>
    </div>
  );
};

export default InputField;
