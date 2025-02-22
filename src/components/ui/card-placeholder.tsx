import * as React from "react";

import { cn } from "@/lib/utils";

const CardPlaceholder = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-inner",
      className,
    )}
    ref={ref}
    {...props}
  />
));
CardPlaceholder.displayName = "CardPlaceholder";

export { CardPlaceholder };
