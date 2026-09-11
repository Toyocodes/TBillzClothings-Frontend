import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getOrderStatusBadgeClass(status) {
  switch (status) {
    case "confirmed":
      return "bg-warning text-neutral-900";
    case "rejected":
      return "bg-destructive text-destructive-foreground";
    case "inShipping":
      return "bg-primary text-primary-foreground";
    case "delivered":
      return "bg-success text-white";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}
