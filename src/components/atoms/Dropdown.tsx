import React from "react";
import { cn } from "../../utils/tailwindMerge";

type DropdownProps = {
  label?: string;
  editable?: boolean;
  options: Record<string, string>;
  value?: string;
  error?: boolean | string;
  helperText?: string;
  flexDir?: "row" | "col";
  className?: string;
  onChange?: (value: string) => void;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange">;

const Dropdown: React.FC<DropdownProps> = ({
  label,
  editable = true,
  options,
  value,
  error = false,
  helperText,
  flexDir = "col",
  className,
  onChange,
  ...restProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        {label && <label className="text-sm">{label}</label>}
        <select
          value={value}
          onChange={handleChange}
          className={cn(
            "border rounded-lg p-2 mt-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-red-500" : "border-gray-400",

            className
          )}
          {...restProps}
          disabled={!editable}
        >
          {Object.entries(options).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-full">
        {error && typeof error === "string" && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        {helperText && (
          <p className="text-gray-500 text-xs mt-1">{helperText}</p>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
