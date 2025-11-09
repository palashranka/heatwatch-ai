import { cn } from "@/lib/utils";
import { RiskLevel } from "./../types/api";

interface RiskBadgeProps {
  level: RiskLevel; // 0-3 to match your API
  label?: string; // Optional custom label from API
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const riskConfig = {
  0: {
    label: "Caution",
    className:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300",
    icon: "●",
  },
  1: {
    label: "Extreme Caution",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300",
    icon: "●",
  },
  2: {
    label: "Danger",
    className:
      "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300",
    icon: "●",
  },
  3: {
    label: "Extreme Danger",
    className:
      "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300",
    icon: "●",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

const RiskBadge = ({
  level,
  label,
  className,
  size = "md",
  showIcon = true,
}: RiskBadgeProps) => {
  const config = riskConfig[level];
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-semibold uppercase tracking-wide border",
        config.className,
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={`Risk level: ${displayLabel}`}
    >
      {showIcon && <span className="animate-pulse">{config.icon}</span>}
      {displayLabel}
    </span>
  );
};

export default RiskBadge;
