import React from 'react';
import { KNODE_THEME } from '../theme/knodeTheme';

/**
 * NotebookCard - Primary Knode card element
 * 
 * @param {Object} props
 * @param {string} [props.label] - Card title/label
 * @param {string} [props.description] - Card description
 * @param {React.ReactNode} [props.icon] - Icon/emoji to display
 * @param {string} [props.color] - Optional accent color override
 * @param {Object} [props.styleTokens] - Style token overrides
 * @param {Object} [props.styleTokens.colors] - Color overrides
 * @param {Object} [props.styleTokens.fonts] - Font overrides
 * @param {'default'|'emphasis'} [props.variant='default'] - Card variant
 */
export const NotebookCard = ({
  label,
  description,
  icon,
  color,
  styleTokens = {},
  variant = 'default',
}) => {
  const colors = { ...KNODE_THEME.colors, ...(styleTokens.colors || {}) };
  const fonts = { ...KNODE_THEME.fonts, ...(styleTokens.fonts || {}) };

  const accent = color || colors.primary;
  const isEmphasis = variant === 'emphasis';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        // Soft, subtle gradient – not "paper texture", just warm
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(255,244,230,0.98))',
        borderRadius: 20,
        boxShadow: '0 14px 30px rgba(0,0,0,0.08)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        overflow: 'hidden',
        // No heavy border – just *maybe* a hint for emphasis
        border: isEmphasis ? `2px solid ${accent}` : '1px solid rgba(0,0,0,0.04)',
      }}
    >
      {/* Accent "halo" behind icon */}
      {icon && (
        <div
          style={{
            position: 'relative',
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: 52,
              height: 52,
              borderRadius: '50%',
              background:
                `radial-gradient(circle at 30% 20%, ${accent}33, transparent 60%)`,
              filter: 'blur(1px)',
            }}
          />
          <div style={{ fontSize: 40, lineHeight: 1, position: 'relative' }}>
            {icon}
          </div>
        </div>
      )}

      {/* Title / label */}
      {label && (
        <div
          style={{
            fontFamily: fonts.marker,          // "permanent marker" vibe
            fontSize: 22,
            lineHeight: 1.25,
            textAlign: 'center',
            color: colors.textMain,
            maxWidth: '90%',
            // Clamp to 2 lines nicely
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {label}
        </div>
      )}

      {/* Description */}
      {description && (
        <div
          style={{
            fontFamily: fonts.header,         // still sketchy, not boring body
            fontSize: 15,
            lineHeight: 1.35,
            textAlign: 'center',
            color: colors.textSoft,
            maxWidth: '90%',
            marginTop: 4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </div>
      )}

      {/* Tiny accent bar at the bottom – keeps it feeling "designed" */}
      <div
        style={{
          marginTop: 8,
          height: 3,
          width: '36%',
          borderRadius: 999,
          background: `linear-gradient(90deg, ${accent}, ${colors.secondary})`,
          opacity: 0.9,
        }}
      />
    </div>
  );
};
