import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useSpeedDial } from "./SpeedDialContext";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isSpeedDialOpen } = useSpeedDial();

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      className={`fixed bottom-24 right-9 z-50 lg:right-4 ${
        isVisible && !isSpeedDialOpen ? "block" : "hidden"
      }`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isVisible && !isSpeedDialOpen ? 1 : 0,
        scale: isVisible && !isSpeedDialOpen ? 1 : 0.5,
      }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={scrollToTop}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-colors"
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>
    </motion.div>
  );
};

export default ScrollToTop;
