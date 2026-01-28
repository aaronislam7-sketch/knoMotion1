/**
 * Accordion Component
 * 
 * Expandable/collapsible content section with smooth animations.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { accordionContent, expandIcon } from '../animations';
import { SPRING_CONFIGS } from '../animations/springs';

export interface AccordionProps {
  /** Header content (always visible) */
  header: React.ReactNode;
  /** Expandable content */
  children: React.ReactNode;
  /** Whether the accordion is initially expanded */
  defaultExpanded?: boolean;
  /** Controlled expanded state */
  expanded?: boolean;
  /** Callback when expanded state changes */
  onToggle?: (expanded: boolean) => void;
  /** Whether to show expand icon */
  showIcon?: boolean;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Additional CSS classes for container */
  className?: string;
  /** Additional CSS classes for header */
  headerClassName?: string;
  /** Additional CSS classes for content */
  contentClassName?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  header,
  children,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onToggle,
  showIcon = true,
  iconPosition = 'right',
  className = '',
  headerClassName = '',
  contentClassName = '',
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  
  // Use controlled state if provided, otherwise use internal state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  
  const handleToggle = () => {
    const newState = !isExpanded;
    setInternalExpanded(newState);
    onToggle?.(newState);
  };

  const ExpandIcon = () => (
    <motion.svg
      className="w-5 h-5 text-kno-ink-soft"
      variants={expandIcon}
      initial="collapsed"
      animate={isExpanded ? 'expanded' : 'collapsed'}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </motion.svg>
  );

  return (
    <div className={`${className}`}>
      {/* Header - clickable */}
      <motion.button
        className={`w-full flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-kno-primary/30 rounded-lg ${headerClassName}`}
        onClick={handleToggle}
        whileTap={{ scale: 0.99 }}
      >
        {showIcon && iconPosition === 'left' && <ExpandIcon />}
        <div className="flex-1">{header}</div>
        {showIcon && iconPosition === 'right' && <ExpandIcon />}
      </motion.button>

      {/* Content - animated */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            variants={accordionContent}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <div className={`pt-4 ${contentClassName}`}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
