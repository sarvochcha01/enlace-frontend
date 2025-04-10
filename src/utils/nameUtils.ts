// utils/nameToColor.ts

/**
 * Generates a consistent color class for a given name
 * @param name - The name to generate a color for
 * @returns A Tailwind CSS color class string (e.g. "bg-blue-500")
 */
export const getNameColor = (name: string): string => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
  ];

  console.log("Name:", name);

  // Generate a hash code from the name string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  hash = Math.abs(hash);

  // Use the hash to select a color deterministically
  const colorIndex = hash % colors.length;
  return colors[colorIndex];
};

// Optional: Add variants for different use cases
export const getNameTextColor = (name: string): string => {
  const bgColor = getNameColor(name);
  return bgColor.replace("bg-", "text-");
};

export const getNameBorderColor = (name: string): string => {
  const bgColor = getNameColor(name);
  return bgColor.replace("bg-", "border-");
};

export const getInitials = (fullName: string) => {
  return fullName
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
};
