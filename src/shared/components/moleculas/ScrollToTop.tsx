// src/components/ScrollToTop.tsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Har safar URL (pathname) o'zgarganda oynani tepaga otadi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Bu komponent vizual hech narsa qaytarmaydi
};

export default ScrollToTop;
