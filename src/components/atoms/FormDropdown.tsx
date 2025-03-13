import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type FormDropdownProps<T extends FieldValues> = {
  label: string;
  options: Record<string, string>;
  id: Path<T>;
  error?: string;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T, Path<T>>;
  helperText?: string;
  flexDir?: "row" | "col";
  className?: string;
};

const FormDropdown = <T extends FieldValues>({
  label,
  options,
  id,
  error,
  register,
  validation,
  helperText,
  flexDir = "col",
  className,
}: FormDropdownProps<T>) => {
  return (
    <div
      className={`flex ${
        flexDir === "col" ? "flex-col" : "flex-row items-center justify-between"
      }`}
    >
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <select
        id={id}
        {...register(id, validation)}
        className={`border rounded-lg p-2 mt-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 ${
          error ? "border-red-500" : "border-gray-400"
        } ${className}`}
      >
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
      {helperText && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
export default FormDropdown;
