import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  CloudSun,
  CalendarDays,
  Sunrise,
  Clock4,
  EllipsisVertical,
} from "lucide-react";
import { useSpeedDial } from "./SpeedDialContext";

// Define the actions for the speed dial in the required sequence
const actions = [
  {
    label: "Current Weather",
    icon: <CloudSun size={20} />,
    href: "#current-weather",
    component: "HeroBlock",
  },
  {
    label: "Daily Forecast",
    icon: <CalendarDays size={20} />,
    href: "#daily-forecast",
    component: "DailyForecast",
  },
  {
    label: "Solar Cycle",
    icon: <Sunrise size={20} />,
    href: "#solar-cycle",
    component: "SunriseSunset",
  },
  {
    label: "Hourly Forecast",
    icon: <Clock4 size={20} />,
    href: "#hourly-forecast",
    component: "HourlyForecast",
  },
];

const SpeedDial = () => {
  const { isSpeedDialOpen, setIsSpeedDialOpen } = useSpeedDial();

  // Animation variants for the list container
  const listVariants = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // Animation variants for each item in the list
  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  const handleScroll = (e, href) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsSpeedDialOpen(false);
  };

  return (
    // Added lg:hidden to hide on large screens and right-8 lg:right-4 to keep button on right
    <div className="fixed bottom-8 right-8 lg:right-4 z-50 flex flex-col items-end gap-3 lg:hidden">
      <AnimatePresence>
        {isSpeedDialOpen && (
          <motion.div
            className="flex flex-col items-end gap-3"
            variants={listVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {actions.map((action) => (
              <motion.a
                key={action.label}
                href={action.href}
                onClick={(e) => handleScroll(e, action.href)}
                className="flex items-center gap-4 no-underline"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="bg-slate-800/80 backdrop-blur-md text-sm text-white px-3 py-1.5 rounded-lg shadow-md">
                  {action.label}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card-hover shadow-lg border border-theme text-primary">
                  {action.icon}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Added ml-auto to keep the toggle button on the right */}
      <motion.button
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-colors ml-auto"
        onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-expanded={isSpeedDialOpen}
        aria-label="Toggle quick actions menu"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isSpeedDialOpen ? "x" : "plus"}
            initial={{ y: -20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {isSpeedDialOpen ? <X size={24} /> : <EllipsisVertical size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default SpeedDial;
