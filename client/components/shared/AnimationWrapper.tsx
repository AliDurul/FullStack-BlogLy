'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type TAnimationWrapper = {
  children: React.ReactNode;
  initial?: Record<string, number>;
  animate?: Record<string, number>;
  transition?: Record<string, number>;
  className?: string;
}

export default function AnimationWrapper({
  children,
  className,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 1 }
}: TAnimationWrapper) {

  return (
    <AnimatePresence>
      <motion.div
        initial={initial}
        animate={animate}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
