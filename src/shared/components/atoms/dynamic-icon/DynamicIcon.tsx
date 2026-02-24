import { icons } from "lucide-react";

interface DynamicIconProps {
  name: string; // Masalan: "file-cog", "user", "arrow-right"
  className?: string;
  size?: number;
  color?: string;
}

const DynamicIcon = ({ name, className, size, color }: DynamicIconProps) => {
  // 1. Kebab-case ni PascalCase ga o'tkazish funksiyasi
  // "file-cog" -> "FileCog"
  // "user" -> "User"
  const pascalCaseName = name
    ?.split("-")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join("");

  // 2. Ikonkani 'icons' obyektidan qidirish
  // @ts-ignore
  const LucideIcon = icons[pascalCaseName];

  // 3. Agar ikonka topilmasa (xatolik bo'lsa)
  if (!LucideIcon) {
    if (import.meta.env.DEV) {
      console.warn(`Icon "${name}" (converted to "${pascalCaseName}") topilmadi.`);
    }
    return null;
  }

  return <LucideIcon className={className} size={size} color={color} />;
};

export default DynamicIcon;
