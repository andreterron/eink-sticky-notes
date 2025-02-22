import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function bucketBy<T, K extends keyof T>(
  array: T[],
  key: K,
): Partial<Record<T[K] & PropertyKey, T[]>> {
  return array.reduce((acc, item) => {
    const value = item[key];
    // Ensure value can be used as an object key
    if (
      value &&
      (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "symbol")
    ) {
      acc[value] = acc[value] || [];
      acc[value].push(item);
    }
    return acc;
  }, {} as Record<T[K] & PropertyKey, T[]>);
}
