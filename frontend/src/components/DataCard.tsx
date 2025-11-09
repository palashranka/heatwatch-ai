import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { RiskArea, RiskLevel } from "@/types/api";

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  loading?: boolean;
  variant?: "default" | "danger" | "warning" | "success";
  onClick?: () => void;
}

const DataCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  loading = false,
  variant = "default",
  onClick,
}: DataCardProps) => {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const variantStyles: Record<string, string> = {
    default: "border-border",
    danger: "border-red-500/50 bg-red-50/50 dark:bg-red-950/20",
    warning: "border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20",
    success: "border-green-500/50 bg-green-50/50 dark:bg-green-950/20",
  };

  const trendStyles: Record<string, string> = {
    up: "text-red-600 dark:text-red-400",
    down: "text-green-600 dark:text-green-400",
    neutral: "text-muted-foreground",
  };

  const getIconColor = () => {
    if (variant === "danger") return "text-red-600";
    if (variant === "warning") return "text-yellow-600";
    if (variant === "success") return "text-green-600";
    return "text-muted-foreground";
  };

  const cardClasses = [
    "transition-all hover:shadow-md",
    variantStyles[variant],
    onClick ? "cursor-pointer hover:scale-[1.02]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className={cardClasses} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${getIconColor()}`} />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 bg-muted animate-pulse rounded" />
        ) : (
          <>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            <div className="flex items-center gap-2 mt-1">
              {trend && trendValue && (
                <div
                  className={`flex items-center text-xs font-medium ${trendStyles[trend]}`}
                >
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {trendValue}
                </div>
              )}
              {description && (
                <p
                  className={`text-xs ${
                    trend && trendValue
                      ? "text-muted-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {description}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;
