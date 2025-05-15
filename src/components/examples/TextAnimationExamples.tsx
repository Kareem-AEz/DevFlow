"use client";

import React, { useState } from "react";

import { AnimatePresence, motion, Variants } from "framer-motion";

const TextAnimationExamples = () => {
  const [isWordStaggerVisible, setIsWordStaggerVisible] = useState(true);
  const [isTypewriterVisible, setIsTypewriterVisible] = useState(true);
  const [isColorShiftVisible, setIsColorShiftVisible] = useState(true);
  const [isTextRevealVisible, setIsTextRevealVisible] = useState(true);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 p-6">
      <h1 className="text-primary-500 text-3xl font-bold">
        Text Animation Examples with Framer Motion
      </h1>

      {/* Example 1: Letter-by-letter animation */}
      <section className="border-light-700 dark:border-dark-400 rounded-xl border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Letter-by-Letter Animation</h2>
          <button
            onClick={() => setIsWordStaggerVisible(!isWordStaggerVisible)}
            className="bg-light-800 dark:bg-dark-300 rounded-lg px-4 py-2"
          >
            {isWordStaggerVisible ? "Hide" : "Show"}
          </button>
        </div>
        <AnimatePresence>
          {isWordStaggerVisible && <LetterByLetterAnimation />}
        </AnimatePresence>
        <div className="bg-light-900 dark:bg-dark-200 mt-4 rounded-md p-4">
          <code className="text-dark-400 dark:text-light-500 text-sm">
            {`const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 100 }
  })
};

// Map through each letter with its index for custom delays
{text.split("").map((letter, i) => (
  <motion.span
    key={i}
    custom={i}
    variants={letterVariants}
    initial="hidden"
    animate="visible"
    className="inline-block"
  >
    {letter === " " ? "\u00A0" : letter}
  </motion.span>
))}`}
          </code>
        </div>
      </section>

      {/* Example 2: Typewriter Effect */}
      <section className="border-light-700 dark:border-dark-400 rounded-xl border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Typewriter Effect</h2>
          <button
            onClick={() => setIsTypewriterVisible(!isTypewriterVisible)}
            className="bg-light-800 dark:bg-dark-300 rounded-lg px-4 py-2"
          >
            {isTypewriterVisible ? "Hide" : "Show"}
          </button>
        </div>
        <AnimatePresence>
          {isTypewriterVisible && <TypewriterEffect />}
        </AnimatePresence>
        <div className="bg-light-900 dark:bg-dark-200 mt-4 rounded-md p-4">
          <code className="text-dark-400 dark:text-light-500 text-sm">
            {`const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

<motion.h3
  className="text-xl font-medium"
  variants={sentence}
  initial="hidden"
  animate="visible"
>
  {text.split("").map((char, index) => (
    <motion.span
      key={index}
      variants={letter}
      className="inline-block"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ))}
</motion.h3>`}
          </code>
        </div>
      </section>

      {/* Example 3: Color Shift Animation */}
      <section className="border-light-700 dark:border-dark-400 rounded-xl border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Color Shift Animation</h2>
          <button
            onClick={() => setIsColorShiftVisible(!isColorShiftVisible)}
            className="bg-light-800 dark:bg-dark-300 rounded-lg px-4 py-2"
          >
            {isColorShiftVisible ? "Hide" : "Show"}
          </button>
        </div>
        <AnimatePresence>
          {isColorShiftVisible && <ColorShiftAnimation />}
        </AnimatePresence>
        <div className="bg-light-900 dark:bg-dark-200 mt-4 rounded-md p-4">
          <code className="text-dark-400 dark:text-light-500 text-sm">
            {`const words = ["Amazing", "Beautiful", "Creative"];
const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"];

<AnimatePresence mode="wait">
  <motion.span
    key={words[currentIndex]}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ 
      duration: 0.5,
      ease: "easeInOut"
    }}
    style={{ 
      color: colors[currentColorIndex],
      display: "inline-block" 
    }}
  >
    {words[currentIndex]}
  </motion.span>
</AnimatePresence>`}
          </code>
        </div>
      </section>

      {/* Example 4: Text Reveal Animation */}
      <section className="border-light-700 dark:border-dark-400 rounded-xl border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Text Reveal Animation</h2>
          <button
            onClick={() => setIsTextRevealVisible(!isTextRevealVisible)}
            className="bg-light-800 dark:bg-dark-300 rounded-lg px-4 py-2"
          >
            {isTextRevealVisible ? "Hide" : "Show"}
          </button>
        </div>
        <AnimatePresence>
          {isTextRevealVisible && <TextRevealAnimation />}
        </AnimatePresence>
        <div className="bg-light-900 dark:bg-dark-200 mt-4 rounded-md p-4">
          <code className="text-dark-400 dark:text-light-500 text-sm">
            {`const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { 
      staggerChildren: 0.12, 
      delayChildren: i * 0.3 
    }
  })
};

const child = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
};

<motion.div
  style={{ overflow: "hidden" }}
  variants={container}
  initial="hidden"
  animate="visible"
  className="flex flex-col gap-3"
>
  {words.map((word, i) => (
    <motion.span 
      key={i} 
      variants={child}
      className="text-xl"
    >
      {word}
    </motion.span>
  ))}
</motion.div>`}
          </code>
        </div>
      </section>
    </div>
  );
};

// Example 1 Component: Letter-by-Letter Animation
const LetterByLetterAnimation = () => {
  const text = "Animate each letter with custom delays";

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, type: "spring", stiffness: 100 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-16 items-center"
    >
      <h3 className="text-primary-500 text-2xl font-bold">
        {text.split("").map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </h3>
    </motion.div>
  );
};

// Example 2 Component: Typewriter Effect
const TypewriterEffect = () => {
  const text = "This text appears like it's being typed...";

  const sentence: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const letter: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-16 items-center"
    >
      <motion.h3
        className="text-xl font-medium"
        variants={sentence}
        initial="hidden"
        animate="visible"
      >
        {text.split("").map((char, index) => (
          <motion.span key={index} variants={letter} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h3>
    </motion.div>
  );
};

// Example 3 Component: Color Shift Animation
const ColorShiftAnimation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const words = ["Amazing", "Beautiful", "Creative"];
  const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"];

  React.useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);

    const colorInterval = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(colorInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-16 items-center"
    >
      <h3 className="text-2xl">
        This is{" "}
        <AnimatePresence mode="wait">
          <motion.span
            key={words[currentIndex]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{
              color: colors[currentColorIndex],
              display: "inline-block",
            }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>{" "}
        text animation
      </h3>
    </motion.div>
  );
};

// Example 4 Component: Text Reveal Animation
const TextRevealAnimation = () => {
  const words = ["Create", "modern", "engaging", "text animations"];

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: i * 0.3,
      },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-32 items-center"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={child} className="text-xl">
            {word}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TextAnimationExamples;
