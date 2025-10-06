import { RefreshCcw, CircleAlert } from "lucide-react";
import { motion } from "framer-motion";

const ApiError = () => {
  // Animation variants for the container and its children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Time delay between each child animating in
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: [-10, 10, -5, 5, 0], // A little wobble effect
      transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.1 },
    },
  };

  return (
    <div role="alert" aria-live="assertive">
      <motion.div
        className="flex items-center justify-center flex-col space-y-4 h-[70vh] text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={iconVariants}>
          <CircleAlert
            className="w-12 h-12 mx-auto text-red-500"
            aria-hidden="true"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-semibold text-primary">
            Something went wrong
          </h1>
          <p className="text-secondary mt-2 max-w-md">
            We couldn't connect to the server. Please check your connection and
            try again in a few moments.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button
            className="flex items-center bg-button hover:bg-button-hover text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={() => window.location.reload()}
            aria-label="Retry loading weather data"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCcw className="w-4 h-4 mr-2" aria-hidden="true" />
            Retry
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ApiError;
