import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// 1. Export the color list so we can use it
export const tailwindColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
];

/**
 * This is a simple, non-cryptographic hash function.
 * It takes a string and converts it into a stable number.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// 2. This is your new function
export function getDeterministicColor(id: string): string {
  // Return a default if no ID is provided
  if (!id) {
    return tailwindColors[0];
  }

  // 1. Create a stable hash from the tutorId
  const hash = simpleHash(id);

  // 2. Use the hash to get a valid index
  // (Math.abs ensures the hash is positive)
  const index = Math.abs(hash) % tailwindColors.length;

  // 3. Return the color from that index
  return tailwindColors[index];
}
