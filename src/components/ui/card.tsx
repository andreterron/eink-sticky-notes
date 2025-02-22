import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
