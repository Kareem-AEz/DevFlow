"use client";

import { useState } from "react";
import useMeasure from "react-use-measure";

import {
  Activity,
  ChevronDown,
  CloudDownload,
  Earth,
  PackageSearch,
} from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

import { cn } from "@/lib/utils";

const faqData = [
  {
    id: 1,
    icon: <Activity />,
    question: "What is Motion?",
    answer:
      "Motion is a powerful animation library for React that enables you to create smooth, interactive animations with minimal code. It provides a simple API for creating complex animations and transitions.",
  },
  {
    id: 2,
    icon: <CloudDownload />,
    question: "How do I install Motion in my project?",
    answer:
      "You can install Motion using npm or yarn. Simply run 'npm install motion' or 'yarn add motion' in your project directory to get started.",
  },
  {
    id: 3,
    icon: <Earth />,
    question: "What browsers does Motion support?",
    answer:
      "Motion supports all modern browsers including Chrome, Firefox, Safari, and Edge. It uses the Web Animations API with fallbacks for broader compatibility.",
  },
  {
    id: 4,
    icon: <PackageSearch />,
    question: "Is Motion production-ready?",
    answer:
      "Yes, Motion is production-ready and is used by many companies in production environments. It's well-tested, performant, and actively maintained by the open source community.",
  },
];

export default function FaqSpring() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex w-96 flex-col">
      <MotionConfig transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}>
        {faqData.map((faq, index) => (
          <FaqItem
            key={faq.id}
            faq={faq}
            active={active}
            setActive={setActive}
            index={index}
          />
        ))}
      </MotionConfig>
    </div>
  );
}

const ChevronDownMotion = motion(ChevronDown);

const FaqItem = ({
  faq,
  active,
  setActive,
  index,
}: {
  faq: (typeof faqData)[number];
  active: number;
  setActive: (id: number) => void;
  index: number;
}) => {
  const [ref, { height }] = useMeasure();

  const isActive = active === faq.id;
  const isFirst = index === 0;
  const isLast = index === faqData.length - 1;
  const activeIndex = faqData.findIndex((item) => item.id === active);
  const isDirectlyAboveActive = index === activeIndex - 1;
  const isDirectlyBelowActive = index === activeIndex + 1;

  const getBorderRadius = () => {
    return {
      borderTopLeftRadius:
        isFirst || isActive || (active > 0 && isDirectlyBelowActive) ? 20 : 0,
      borderTopRightRadius:
        isFirst || isActive || (active > 0 && isDirectlyBelowActive) ? 20 : 0,
      borderBottomLeftRadius:
        isLast || isActive || (active > 0 && isDirectlyAboveActive) ? 20 : 0,
      borderBottomRightRadius:
        isLast || isActive || (active > 0 && isDirectlyAboveActive) ? 20 : 0,
    };
  };

  const getBorderClasses = () => {
    return cn("relative overflow-hidden", "border-x", {
      "border-t": isFirst || isActive || isDirectlyBelowActive,
      "border-b": isLast || isActive || isDirectlyAboveActive,
    });
  };

  return (
    <motion.div
      initial={{
        borderTopLeftRadius: isFirst ? 20 : 0,
        borderTopRightRadius: isFirst ? 20 : 0,
        borderBottomLeftRadius: isLast ? 20 : 0,
        borderBottomRightRadius: isLast ? 20 : 0,
        height: "auto",
      }}
      animate={{
        height: height > 0 ? height : undefined,
        marginTop: active === faq.id && index !== 0 ? 20 : 0,
        marginBottom:
          active === faq.id && index !== faqData.length - 1 ? 20 : 0,
        ...getBorderRadius(),
      }}
      className={getBorderClasses()}
    >
      <div
        ref={ref}
        className="flex cursor-pointer flex-col gap-2 p-3"
        onClick={() => setActive(active === faq.id ? 0 : faq.id)}
      >
        <p className="flex items-center gap-3 font-semibold">
          {faq.icon}
          {faq.question}
          <ChevronDownMotion
            animate={{ rotate: active === faq.id ? 180 : 0 }}
            className="ml-auto"
            size={16}
          />
        </p>
        <AnimatePresence mode="popLayout">
          {active === faq.id && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm"
            >
              {faq.answer}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
