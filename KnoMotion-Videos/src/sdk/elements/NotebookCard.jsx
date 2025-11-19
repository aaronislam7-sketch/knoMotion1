// sdk/elements/NotebookCard.jsx
import React from 'react';

/**
 * Knode-ified notebook-style card
 *
 * - Uses Tailwind for layout/spacing/typography
 * - Uses `accentColor` from style_tokens via inline style
 * - Domain-agnostic: just title, description, icon
 *
 * Variants can be extended later (e.g. "outline", "subtle", "hero")
 */
export const NotebookCard = ({
  title,
  description,
  icon,
  accentColor = '#FF6B35',
  variant = 'default',
  className = '',
}) => {
  const borderColor = accentColor;
  const glowColor = accentColor + '33';

  return (
    <div
      className={[
        // base notebook card
        'relative flex flex-col items-center justify-center',
        'rounded-2xl border bg-slate-950/80 shadow-[0_18px_40px_rgba(0,0,0,0.6)]',
        'px-6 py-5 gap-3',
        // subtle notebook-esque details
        'before:absolute before:inset-[12px] before:rounded-2xl before:border before:border-white/5 before:pointer-events-none',
        'overflow-hidden',
        className,
      ].join(' ')}
      style={{
        borderColor,
        boxShadow: `0 14px 40px ${glowColor}`,
      }}
    >
      {/* Faint scribble / header bar */}
      <div
        className="absolute inset-x-6 top-4 h-[2px] opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, transparent 0, currentColor 10%, transparent 20%)',
          color: borderColor,
        }}
      />

      {icon && (
        <div className="text-4xl leading-none mb-1">
          {icon}
        </div>
      )}

      {title && (
        <div
          className="text-center font-semibold leading-snug line-clamp-2"
          style={{
            color: '#FFFFFF',
            fontSize: '1.1rem',
          }}
        >
          {title}
        </div>
      )}

      {description && (
        <div
          className="text-center text-sm leading-snug line-clamp-3"
          style={{
            color: '#B0B0B0',
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default NotebookCard;
