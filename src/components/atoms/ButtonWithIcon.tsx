import { cn } from "../../utils/tailwindMerge";

interface ButtonWithIconProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  bg?: "no-bg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  icon,
  text,
  onClick,
  bg,
  type = "button",
  disabled = false,
  className,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "flex gap-1 items-center justify-center rounded-lg px-4 py-2",
        bg == "no-bg"
          ? "hover:bg-gray-200 text-primary"
          : "bg-primary hover:bg-[#0055bb] text-white",
        disabled && "opacity-50 cursor-not-allowed ",
        className
      )}
      onClick={onClick}
    >
      <span className="flex items-center">{icon}</span>
      <span className="flex items-center leading-none">{text}</span>
    </button>
  );
};

export default ButtonWithIcon;
