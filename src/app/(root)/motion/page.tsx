"use client";

import { useEffect } from "react";

import { useAnimate } from "motion/react";

export default function Motion() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // WORKAROUND: Motion has a bug where opacity doesn't respect autoplay: false
    // due to CSS reconciliation issues. When Motion detects CSS opacity-0 class,
    // it immediately tries to reconcile the state, causing opacity to animate
    // immediately while transform properties correctly wait for autoplay.
    //
    // SOLUTION: Simply delay the entire animate call to avoid the reconciliation
    // bug entirely. This is cleaner than setting initial state separately.
    //
    // Animation flow:
    // 1. (initial render) CSS opacity-0 applied, element is hidden
    // 2. (after 3 seconds) Motion animates both opacity and transform together
    // 3. No immediate reconciliation = both properties behave consistently
    setTimeout(() => {
      animate("h1", { opacity: 1, x: 200 }, { duration: 5 });
    }, 3000);
  }, []);

  return (
    <div ref={scope} className="grid min-h-dvh place-items-center text-white">
      <div className="flex flex-col items-center">
        <img
          className="mb-8 h-12 w-12"
          src="https://sandpack.frontend.fyi/img/fefyi.svg"
        />
        {/* CSS opacity-0 for initial render, Motion will animate from this state */}
        <h1 className="mb-6 max-w-[60%] text-center font-mono text-3xl text-balance text-white opacity-0">
          Time to draw some rectangles
        </h1>
        <a
          href="https://www.frontend.fyi/dev"
          target="_blank"
          className="text-sm uppercase"
        >
          Frontend.FYI Dev Playgrounds
        </a>
      </div>
    </div>
  );
}
