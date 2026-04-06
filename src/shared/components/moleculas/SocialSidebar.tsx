import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { get } from "lodash";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandYoutube,
} from "@tabler/icons-react";

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
  shadowColor: string;
}

export const SocialSidebar = () => {
  const { data: company } = useCompanyInfo();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const socialLinks: SocialLink[] = useMemo(
    () => [
      {
        name: "Telegram",
        icon: <IconBrandTelegram size={20} stroke={1.5} />,
        href: get(company, "telegram", "https://t.me") as string,
        gradient: "from-[#2AABEE] to-[#229ED9]",
        shadowColor: "rgba(42, 171, 238, 0.4)",
      },
      {
        name: "Instagram",
        icon: <IconBrandInstagram size={20} stroke={1.5} />,
        href: get(company, "instagram", "https://instagram.com") as string,
        gradient: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
        shadowColor: "rgba(221, 42, 123, 0.4)",
      },
      {
        name: "Facebook",
        icon: <IconBrandFacebook size={20} stroke={1.5} />,
        href: get(company, "facebook", "https://facebook.com") as string,
        gradient: "from-[#1877F2] to-[#0C5DC7]",
        shadowColor: "rgba(24, 119, 242, 0.4)",
      },
      {
        name: "YouTube",
        icon: <IconBrandYoutube size={20} stroke={1.5} />,
        href: get(company, "youtube", "https://youtube.com") as string,
        gradient: "from-[#FF0000] to-[#CC0000]",
        shadowColor: "rgba(255, 0, 0, 0.4)",
      },
    ],
    [company],
  );

  return (
    <>
      {/* ===== DESKTOP: O'ng tomonda doimiy fixed sidebar ===== */}
      <motion.div
        className="fixed right-0 top-1/2 z-50 hidden md:block"
        initial={{ x: 80, y: "-50%", opacity: 0 }}
        animate={{ x: 0, y: "-50%", opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.4 }}
      >
        <div className="relative flex flex-col gap-2 rounded-l-2xl border border-white/20 bg-white/60 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60">
          {/* Yorug'lik effekti */}
          <div className="pointer-events-none absolute inset-0 rounded-l-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5" />

          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative z-10 flex items-center"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Tooltip — chap tomonda chiqadi */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.span
                    initial={{ opacity: 0, x: 8, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-full mr-3 whitespace-nowrap rounded-lg bg-gradient-to-r ${social.gradient} px-3 py-1.5 text-xs font-semibold text-white shadow-lg`}
                  >
                    {social.name}
                    <div className="absolute right-[-3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-gradient-to-br from-transparent to-current opacity-80" />
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Ikonka tugmasi */}
              <div
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-all duration-300 dark:text-gray-400"
                style={{
                  boxShadow:
                    hoveredIndex === index
                      ? `0 4px 16px ${social.shadowColor}`
                      : "none",
                }}
              >
                {/* Hover gradient fon */}
                <motion.div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${social.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                {/* Ikonka */}
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {social.icon}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

    </>
  );
};
