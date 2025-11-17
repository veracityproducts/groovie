'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/shared/lib/cn';

export interface StitchedTabsProps {
  tabs: {
    id: string;
    label: string;
    content?: React.ReactNode;
  }[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

/**
 * StitchedTabs - Tab component with stitched button aesthetic
 * Features:
 * - Thick primary border with perforated dotted line inside
 * - Smooth spring animations for tab transitions
 * - Active tab indicator with spring physics
 * - Optional content area with slide transitions
 * - Full dark mode support
 */
export const StitchedTabs = React.forwardRef<
  HTMLDivElement,
  StitchedTabsProps
>(
  (
    {
      tabs,
      defaultTab,
      onChange,
      className,
    },
    ref,
  ) => {
    const [activeTab, setActiveTab] = React.useState(
      defaultTab || tabs[0]?.id || '',
    );

    const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);
      onChange?.(tabId);
    };

    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

    return (
      <div ref={ref} className={cn('flex flex-col gap-4', className)}>
        {/* Tab container with stitched border */}
        <div className="relative rounded-lg border-4 border-primary-500 bg-background dark:border-primary-600">
          {/* Perforated dotted line overlay */}
          <div className="absolute inset-0 rounded-lg border-2 border-dashed border-primary-100 dark:border-primary-900 pointer-events-none" />

          {/* Tab buttons */}
          <div className="relative flex z-10">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'flex-1 py-4 px-6 font-semibold text-center transition-colors duration-200 relative',
                    isActive
                      ? 'text-white'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-selected={isActive}
                  role="tab"
                >
                  {/* Active indicator background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-primary-500 dark:bg-primary-600 -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Tab text with animation */}
                  <motion.span
                    key={`${activeTab}-${tab.id}`}
                    initial={{
                      opacity: 0,
                      y: isActive ? -4 : 4,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    {tab.label}
                  </motion.span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content area with slide transition */}
        {tabs.some((tab) => tab.content) && (
          <AnimatePresence mode="wait">
            {tabs.map(
              (tab) =>
                tab.id === activeTab &&
                tab.content && (
                  <motion.div
                    key={`content-${tab.id}`}
                    initial={{
                      opacity: 0,
                      x: activeIndex > 0 ? -20 : 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: activeIndex > 0 ? -20 : 20,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    {tab.content}
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        )}
      </div>
    );
  },
);

StitchedTabs.displayName = 'StitchedTabs';
