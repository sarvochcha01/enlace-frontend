import React from "react";
import {
  Path,
  UseFormRegister,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { cn } from "../../utils/tailwindMerge";

type FormInputFieldProps<T extends FieldValues> = {
  label: string;
  id: Path<T>;
  type?: string;
  error?: string;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T, Path<T>>;
  helperText?: string;
  flexDir?: "row" | "col";
  isEditing?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormInputField = <T extends FieldValues>({
  label,
  id,
  type = "text",
  error,
  register,
  validation,
  helperText,
  flexDir = "col",
  className,
  ...rest
}: FormInputFieldProps<T>) => {
  const handleDateFormat = (value: unknown) => {
    if (type === "date") {
      if (typeof value === "string" && value.includes("T")) {
        return value.split("T")[0]; // Strips time portion if present
      }
      if (value instanceof Date) {
        return value.toISOString().split("T")[0]; // Convert Date object to YYYY-MM-DD
      }
    }
    return value ?? ""; // Ensure we never return undefined
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
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
        <input
          id={id}
          type={type}
          {...(register &&
            register(id, {
              ...validation,
              setValueAs: (value) => handleDateFormat(value),
            }))}
          className={cn(
            "border rounded-lg p-2 mt-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48",
            error ? "border-red-500 " : "border-gray-400 ",
            className
          )}
          {...rest}
        />
      </div>
      <div className="flex flex-col w-full ">
        {error && <p className="text-red-500 text-sm ">{error}</p>}
        {helperText && (
          <p className="text-gray-500 text-xs mt-1 ">{helperText}</p>
        )}
      </div>
    </div>
  );
};

export default FormInputField;
