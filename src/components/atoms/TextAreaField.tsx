import React from "react";
import {
  Path,
  UseFormRegister,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { cn } from "../../utils/tailwindMerge";

type TextAreaFieldProps<T extends FieldValues> = {
  label: string;
  id: Path<T>;
  error?: string;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T, Path<T>>;
  helperText?: string;
  className?: string;
  resizable?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextAreaField = <T extends FieldValues>({
  label,
  id,
  error,
  register,
  validation,
  helperText,
  className,
  resizable = true,
  ...rest
}: TextAreaFieldProps<T>) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        {...register(id, validation)}
        className={cn(
          "border rounded-lg p-2 mt-2 outline-none min-h-56 focus:border-primary focus:ring-1 focus:ring-primary",
          error ? "border-red-500 " : "border-gray-400 ",
          resizable ? "resize-y" : "resize-none",
          className
        )}
        {...rest}
      />
      {helperText && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default TextAreaField;
