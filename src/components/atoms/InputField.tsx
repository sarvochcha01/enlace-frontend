import React, { useState } from "react";
import {
  Path,
  UseFormRegister,
  FieldValues,
  RegisterOptions,
  Controller,
  Control,
} from "react-hook-form";
import { cn } from "../../utils/tailwindMerge";

type InputFieldProps<T extends FieldValues> = {
  label: string;
  id: Path<T>;
  type?: string;
  error?: string;
  register?: UseFormRegister<T>; // Make register optional since we'll use Controller for dates
  control?: Control<T>; // Add control for using Controller
  validation?: RegisterOptions<T, Path<T>>;
  helperText?: string;
  flexDir?: "row" | "col";
  isEditing?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputField = <T extends FieldValues>({
  label,
  id,
  type = "text",
  error,
  register,
  control,
  validation,
  helperText,
  flexDir = "col",
  className,
  ...rest
}: InputFieldProps<T>) => {
  // If it's a date input and we have control, use Controller
  if (type === "date" && control) {
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
          <Controller
            control={control}
            name={id}
            rules={validation}
            render={({ field: { onChange, value, ref } }) => (
              <input
                id={id}
                type="date"
                value={
                  value
                    ? typeof value === "object" && "Time" in value
                      ? value.Time
                        ? value.Time.split("T")[0]
                        : ""
                      : (value as string)
                    : ""
                }
                onChange={(e) => {
                  const dateValue = e.target.value;
                  // Transform to NullTime format immediately
                  const nullTimeValue = dateValue
                    ? { Time: `${dateValue}T00:00:00Z`, Valid: true }
                    : { Time: null, Valid: false };
                  onChange(nullTimeValue);
                }}
                ref={ref}
                className={cn(
                  "border rounded-lg p-2 mt-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48",
                  error ? "border-red-500 " : "border-gray-400 ",
                  className
                )}
                {...rest}
              />
            )}
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
  }

  // Regular input for non-date fields
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
          {...(register && register(id, validation))}
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

export default InputField;
