import React, { useState } from 'react';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

/**
 * ElementShowcase - Pure React showcase without Remotion dependencies
 * Shows all element styles using plain HTML/CSS
 */
export const ElementShowcase = () => {
  const theme = KNODE_THEME;
  const [selectedTab, setSelectedTab] = useState('atoms');

  const styles = {
    container: {
      fontFamily: theme.fonts.body,
      backgroundColor: theme.colors.bg,
      minHeight: '100vh',
      padding: '40px',
    },
    header: {
      borderBottom: `3px solid ${theme.colors.primary}`,
      paddingBottom: '20px',
      marginBottom: '40px',
    },
    nav: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      borderBottom: `1px solid ${theme.colors.textMain}20`,
      paddingBottom: '10px',
    },
    navButton: {
      padding: '10px 20px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: theme.fonts.body,
      fontSize: 16,
      fontWeight: 600,
      color: theme.colors.textMain,
      borderBottom: '3px solid transparent',
      transition: 'all 0.2s',
    },
    navButtonActive: {
      borderBottom: `3px solid ${theme.colors.primary}`,
      color: theme.colors.primary,
    },
    section: {
      marginBottom: '60px',
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: 700,
      fontFamily: theme.fonts.header,
      color: theme.colors.textMain,
      marginBottom: '10px',
    },
    sectionDesc: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: '25px',
    },
    showcase: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginBottom: '40px',
    },
    demoBox: {
      padding: '25px',
      backgroundColor: '#fff',
      borderRadius: theme.radii.card,
      border: `1px solid ${theme.colors.textMain}10`,
      boxShadow: theme.shadows.soft,
    },
    demoTitle: {
      fontSize: 18,
      fontWeight: 600,
      fontFamily: theme.fonts.header,
      color: theme.colors.textMain,
      marginBottom: '20px',
    },
    demoContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    variantRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: theme.colors.textSecondary,
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    // Pure CSS element styles (no Remotion)
    badge: (variant, size) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: size === 'sm' ? '4px 8px' : size === 'lg' ? '8px 16px' : '6px 12px',
      borderRadius: '6px',
      fontSize: size === 'sm' ? 12 : size === 'lg' ? 16 : 14,
      fontFamily: theme.fonts.body,
      fontWeight: 500,
      backgroundColor: {
        default: theme.colors.textMain,
        primary: theme.colors.primary,
        success: theme.colors.accentGreen,
        warning: theme.colors.doodle,
        danger: '#E74C3C',
      }[variant],
      color: variant === 'warning' ? theme.colors.textMain : theme.colors.cardBg,
    }),
    button: (variant, size) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '12px 24px',
      borderRadius: theme.radii.card,
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
      fontFamily: theme.fonts.body,
      fontWeight: 600,
      cursor: 'default',
      border: variant === 'outline' ? `2px solid ${theme.colors.primary}` : variant === 'default' ? `2px solid ${theme.colors.textMain}20` : 'none',
      backgroundColor: {
        default: theme.colors.cardBg,
        primary: theme.colors.primary,
        success: theme.colors.accentGreen,
        outline: 'transparent',
      }[variant],
      color: variant === 'outline' ? theme.colors.primary : variant === 'default' ? theme.colors.textMain : theme.colors.cardBg,
    }),
    card: (variant) => ({
      padding: theme.spacing.cardPadding,
      borderRadius: theme.radii.card,
      backgroundColor: variant === 'glass' ? 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(255,244,230,0.98))' : theme.colors.cardBg,
      border: variant === 'bordered' ? `2px solid ${theme.colors.textMain}20` : 'none',
      boxShadow: variant === 'bordered' ? 'none' : theme.shadows.card,
    }),
  };

  // Atomic Elements Showcase
  const renderAtomicElements = () => (
    <>
      {/* Badge */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Badge</h2>
        <p style={styles.sectionDesc}>Labels and tags for categorization</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Variants</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <div style={styles.badge('default', 'md')}>Default</div>
                <div style={styles.badge('primary', 'md')}>Primary</div>
                <div style={styles.badge('success', 'md')}>Success</div>
                <div style={styles.badge('warning', 'md')}>Warning</div>
                <div style={styles.badge('danger', 'md')}>Danger</div>
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <div style={styles.badge('primary', 'sm')}>Small</div>
                <div style={styles.badge('primary', 'md')}>Medium</div>
                <div style={styles.badge('primary', 'lg')}>Large</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Button</h2>
        <p style={styles.sectionDesc}>Visual button elements (non-interactive for video)</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Variants</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <div style={styles.button('default', 'md')}>Default</div>
                <div style={styles.button('primary', 'md')}>Primary</div>
                <div style={styles.button('success', 'md')}>Success</div>
                <div style={styles.button('outline', 'md')}>Outline</div>
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>With Icons</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <div style={styles.button('primary', 'md')}><span>🚀</span> With Icon</div>
                <div style={styles.button('success', 'md')}><span>⬇️</span> Download</div>
                <div style={styles.button('outline', 'md')}><span>⚙️</span> Settings</div>
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <div style={styles.button('primary', 'sm')}>Small</div>
                <div style={styles.button('primary', 'md')}>Medium</div>
                <div style={styles.button('primary', 'lg')}>Large</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Card</h2>
        <p style={styles.sectionDesc}>Container cards with multiple variants</p>
        
        <div style={styles.showcase}>
          <div style={styles.card('default')}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.header, marginBottom: 8 }}>Default Card</div>
            <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>Standard card with shadow</div>
          </div>

          <div style={styles.card('bordered')}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.header, marginBottom: 8 }}>Bordered Card</div>
            <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>Card with border, no shadow</div>
          </div>

          <div style={styles.card('glass')}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.header, marginBottom: 8 }}>Glass Card</div>
            <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>Glassmorphic effect</div>
          </div>
        </div>
      </div>

      {/* Text */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Text</h2>
        <p style={styles.sectionDesc}>Themed text with multiple variants and sizes</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Variants</div>
            <div style={styles.demoContent}>
              <div style={{ fontFamily: theme.fonts.marker, fontSize: 24, fontWeight: 700 }}>Display Text</div>
              <div style={{ fontFamily: theme.fonts.header, fontSize: 20, fontWeight: 700 }}>Title Text</div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 16 }}>Body Text</div>
              <div style={{ fontFamily: theme.fonts.header, fontSize: 16 }}>Accent Text</div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <div style={{ fontSize: 12 }}>Extra Small (xs)</div>
              <div style={{ fontSize: 14 }}>Small (sm)</div>
              <div style={{ fontSize: 16 }}>Medium (md)</div>
              <div style={{ fontSize: 20 }}>Large (lg)</div>
              <div style={{ fontSize: 28 }}>Extra Large (xl)</div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Weights</div>
            <div style={styles.demoContent}>
              <div style={{ fontWeight: 400 }}>Normal Weight (400)</div>
              <div style={{ fontWeight: 600 }}>Medium Weight (600)</div>
              <div style={{ fontWeight: 700 }}>Bold Weight (700)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Icon */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Icon</h2>
        <p style={styles.sectionDesc}>Icons and emojis with size variants</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <span style={{ fontSize: 24 }}>🎨</span>
                <span style={{ fontSize: 40 }}>🎨</span>
                <span style={{ fontSize: 60 }}>🎨</span>
                <span style={{ fontSize: 80 }}>🎨</span>
              </div>
              <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 10 }}>
                sm (24px) → md (40px) → lg (60px) → xl (80px)
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Different Icons</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <span style={{ fontSize: 60 }}>🚀</span>
                <span style={{ fontSize: 60, color: theme.colors.primary }}>⚡</span>
                <span style={{ fontSize: 60 }}>🎓</span>
                <span style={{ fontSize: 60 }}>🎯</span>
                <span style={{ fontSize: 60 }}>💡</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Alert ✨ NEW</h2>
        <p style={styles.sectionDesc}>Informational message boxes with icons</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Variants</div>
            <div style={styles.demoContent}>
              {['info', 'success', 'warning', 'error'].map(variant => {
                const colors = {
                  info: { bg: theme.colors.primary, text: theme.colors.cardBg },
                  success: { bg: theme.colors.accentGreen, text: theme.colors.cardBg },
                  warning: { bg: theme.colors.doodle, text: theme.colors.textMain },
                  error: { bg: '#E74C3C', text: theme.colors.cardBg },
                };
                const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
                return (
                  <div key={variant} style={{
                    display: 'flex',
                    gap: 10,
                    padding: theme.spacing.cardPadding,
                    borderRadius: theme.radii.card,
                    backgroundColor: colors[variant].bg,
                    color: colors[variant].text,
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 20 }}>{icons[variant]}</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{variant.charAt(0).toUpperCase() + variant.slice(1)}</div>
                      <div style={{ fontSize: 14 }}>This is a {variant} alert message</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Styles</div>
            <div style={styles.demoContent}>
              {/* Outline */}
              <div style={{
                display: 'flex',
                gap: 10,
                padding: theme.spacing.cardPadding,
                borderRadius: theme.radii.card,
                backgroundColor: theme.colors.cardBg,
                border: `2px solid ${theme.colors.primary}`,
                color: theme.colors.primary,
              }}>
                <span style={{ fontSize: 20 }}>ℹ️</span>
                <div style={{ fontSize: 14 }}>Outline style alert</div>
              </div>
              {/* Soft */}
              <div style={{
                display: 'flex',
                gap: 10,
                padding: theme.spacing.cardPadding,
                borderRadius: theme.radii.card,
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.textMain,
              }}>
                <span style={{ fontSize: 20 }}>ℹ️</span>
                <div style={{ fontSize: 14 }}>Soft style alert</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Avatar ✨ NEW</h2>
        <p style={styles.sectionDesc}>User profile images with status indicators</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                {[40, 60, 80, 100].map(size => (
                  <div key={size} style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.cardBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: theme.fonts.header,
                    fontWeight: 700,
                    fontSize: size * 0.4,
                  }}>
                    KM
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Status & Ring</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                {/* Online */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.cardBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 24,
                    border: `3px solid ${theme.colors.primary}`,
                    boxShadow: `0 0 0 3px ${theme.colors.cardBg}`,
                  }}>KM</div>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.accentGreen,
                    border: `2px solid ${theme.colors.cardBg}`,
                  }} />
                </div>
                {/* Away */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.cardBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 24,
                  }}>AB</div>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.doodle,
                    border: `2px solid ${theme.colors.cardBg}`,
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Loading ✨ NEW</h2>
        <p style={styles.sectionDesc}>Animated loading indicators</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Variants</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                {/* Spinner */}
                <div style={{
                  width: 40,
                  height: 40,
                  border: `5px solid ${theme.colors.primary}20`,
                  borderTopColor: theme.colors.primary,
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }} />
                {/* Dots */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: theme.colors.primary,
                      animation: `pulse 1.4s ease-in-out ${delay}s infinite`,
                    }} />
                  ))}
                </div>
                {/* Ring */}
                <div style={{
                  width: 40,
                  height: 40,
                  border: `4px solid transparent`,
                  borderTopColor: theme.colors.primary,
                  borderBottomColor: theme.colors.primary,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Skeleton ✨ NEW</h2>
        <p style={styles.sectionDesc}>Loading state placeholders</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Variants</div>
            <div style={styles.demoContent}>
              {/* Text lines */}
              <div style={{ width: '100%', height: 16, borderRadius: 4, backgroundColor: `${theme.colors.textMain}10` }} />
              <div style={{ width: '80%', height: 16, borderRadius: 4, backgroundColor: `${theme.colors.textMain}10` }} />
              <div style={{ width: '90%', height: 16, borderRadius: 4, backgroundColor: `${theme.colors.textMain}10` }} />
              {/* Circle */}
              <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: `${theme.colors.textMain}10` }} />
              {/* Rectangle */}
              <div style={{ width: 200, height: 100, borderRadius: theme.radii.card, backgroundColor: `${theme.colors.textMain}10` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Rating ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Rating ✨ NEW</h2>
        <p style={styles.sectionDesc}>Star rating displays</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Star Ratings</div>
            <div style={styles.demoContent}>
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 24, display: 'flex', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} style={{ color: star <= rating ? theme.colors.doodle : `${theme.colors.textMain}20` }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 14, color: theme.colors.textSecondary }}>({rating}/5)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RadialProgress ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>RadialProgress ✨ NEW</h2>
        <p style={styles.sectionDesc}>Circular progress indicators</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Progress Values</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                {[25, 50, 75, 100].map(value => {
                  const size = 100;
                  const thickness = 4;
                  const radius = (size - thickness * 2) / 2;
                  const circumference = 2 * Math.PI * radius;
                  const offset = circumference - (value / 100) * circumference;
                  
                  return (
                    <div key={value} style={{ position: 'relative', width: size, height: size }}>
                      <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={`${theme.colors.textMain}10`} strokeWidth={thickness} />
                        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={theme.colors.primary} strokeWidth={thickness} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>{value}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Progress</h2>
        <p style={styles.sectionDesc}>Progress bars with labels</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Variants</div>
            <div style={styles.demoContent}>
              <div>
                <div style={{ fontSize: 12, marginBottom: 6, color: theme.colors.textSecondary }}>Primary Progress (75%)</div>
                <div style={{ width: '100%', height: 16, borderRadius: 999, backgroundColor: `${theme.colors.primary}20`, overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', backgroundColor: theme.colors.primary, transition: 'width 0.3s' }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, marginBottom: 6, color: theme.colors.textSecondary }}>Success Progress (50%)</div>
                <div style={{ width: '100%', height: 16, borderRadius: 999, backgroundColor: `${theme.colors.accentGreen}20`, overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', backgroundColor: theme.colors.accentGreen, transition: 'width 0.3s' }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, marginBottom: 6, color: theme.colors.textSecondary }}>Warning Progress (30%)</div>
                <div style={{ width: '100%', height: 16, borderRadius: 999, backgroundColor: `${theme.colors.doodle}20`, overflow: 'hidden' }}>
                  <div style={{ width: '30%', height: '100%', backgroundColor: theme.colors.doodle, transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <div>
                <div style={{ fontSize: 12, marginBottom: 6, color: theme.colors.textSecondary }}>Small (8px)</div>
                <div style={{ width: '100%', height: 8, borderRadius: 999, backgroundColor: `${theme.colors.primary}20`, overflow: 'hidden' }}>
                  <div style={{ width: '60%', height: '100%', backgroundColor: theme.colors.primary }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, marginBottom: 6, color: theme.colors.textSecondary }}>Medium (16px)</div>
                <div style={{ width: '100%', height: 16, borderRadius: 999, backgroundColor: `${theme.colors.primary}20`, overflow: 'hidden' }}>
                  <div style={{ width: '60%', height: '100%', backgroundColor: theme.colors.primary }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, marginBottom: 6, color: theme.colors.textSecondary }}>Large (24px)</div>
                <div style={{ width: '100%', height: 24, borderRadius: 999, backgroundColor: `${theme.colors.primary}20`, overflow: 'hidden' }}>
                  <div style={{ width: '60%', height: '100%', backgroundColor: theme.colors.primary }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Divider</h2>
        <p style={styles.sectionDesc}>Horizontal and vertical separators</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Variants</div>
            <div style={styles.demoContent}>
              <div>
                <div style={styles.label}>Solid</div>
                <div style={{ height: 2, width: '100%', backgroundColor: `${theme.colors.textMain}33` }} />
              </div>
              <div>
                <div style={styles.label}>Dashed</div>
                <div style={{ height: 2, width: '100%', borderTop: `2px dashed ${theme.colors.textMain}33` }} />
              </div>
              <div>
                <div style={styles.label}>Dotted</div>
                <div style={{ height: 2, width: '100%', borderTop: `2px dotted ${theme.colors.textMain}33` }} />
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Colored</div>
            <div style={styles.demoContent}>
              <div style={{ height: 3, width: '100%', backgroundColor: theme.colors.primary }} />
              <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 5 }}>Primary color divider</div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicator */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Indicator</h2>
        <p style={styles.sectionDesc}>Notification dots and badges</p>
        
        <div style={styles.showcase}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Variants</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                {['primary', 'success', 'warning', 'danger'].map(variant => (
                  <div key={variant} style={{ position: 'relative', width: 60, height: 60, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      border: `2px solid ${theme.colors.cardBg}`,
                      backgroundColor: {
                        primary: theme.colors.primary,
                        success: theme.colors.accentGreen,
                        warning: theme.colors.doodle,
                        danger: '#E74C3C',
                      }[variant],
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>With Icon</div>
            <div style={styles.demoContent}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ fontSize: 80 }}>🔔</span>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: `2px solid ${theme.colors.bg}`,
                  backgroundColor: '#E74C3C',
                  animation: 'pulse 2s infinite',
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Composition Elements Showcase
  const renderCompositionElements = () => (
    <>
      {/* CardWithBadge */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>CardWithBadge</h2>
        <p style={styles.sectionDesc}>Card with positioned badge overlay</p>
        
        <div style={styles.showcase}>
          {[
            { badge: 'New', variant: 'success', pos: 'top-right', title: 'Featured Content' },
            { badge: 'Hot', variant: 'danger', pos: 'top-left', title: 'Trending Item' },
            { badge: 'Sale', variant: 'warning', pos: 'bottom-right', title: 'Special Offer' },
          ].map((item, i) => (
            <div key={i} style={{ position: 'relative', ...styles.card('default') }}>
              <div style={{
                position: 'absolute',
                [item.pos.split('-')[0]]: -10,
                [item.pos.split('-')[1]]: -10,
                ...styles.badge(item.variant, 'sm'),
              }}>{item.badge}</div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.header, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>Card with badge in {item.pos}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CardWithIcon */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>CardWithIcon</h2>
        <p style={styles.sectionDesc}>Card with icon and text layout</p>
        
        <div style={styles.showcase}>
          {[
            { icon: '🚀', title: 'Fast Performance', text: 'Lightning-fast rendering' },
            { icon: '🎨', title: 'Beautiful Design', text: 'Stunning visuals' },
            { icon: '⚙️', title: 'Easy Configuration', text: 'Simple JSON-based setup' },
          ].map((item, i) => (
            <div key={i} style={styles.card('default')}>
              <div style={{ display: 'flex', gap: theme.spacing.cardPadding, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 60 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.header, marginBottom: 8 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>{item.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HeroWithText */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>HeroWithText</h2>
        <p style={styles.sectionDesc}>Hero section with icon/image and text</p>
        
        <div style={styles.showcase}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20 }}>
            <span style={{ fontSize: 80 }}>🎓</span>
            <div>
              <div style={{ fontSize: 48, fontWeight: 700, fontFamily: theme.fonts.marker }}>Learn Anything, Anywhere</div>
              <div style={{ height: 3, width: 200, backgroundColor: theme.colors.primary, margin: '15px auto' }} />
              <div style={{ fontSize: 24, color: theme.colors.textSecondary, marginTop: 10 }}>Powered by KnoMotion Video Engine</div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 30 }}>
            <span style={{ fontSize: 80 }}>⚡</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 48, fontWeight: 700, fontFamily: theme.fonts.marker }}>Lightning Fast</div>
              <div style={{ height: 3, width: '100%', backgroundColor: theme.colors.primary, margin: '15px 0' }} />
              <div style={{ fontSize: 24, color: theme.colors.textSecondary }}>Create videos in minutes, not days</div>
            </div>
          </div>
        </div>
      </div>

      {/* StatCard */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>StatCard</h2>
        <p style={styles.sectionDesc}>Statistics display with trends</p>
        
        <div style={styles.showcase}>
          {[
            { value: '98%', label: 'Success Rate', icon: '⭐', trend: 'up' },
            { value: '250K', label: 'Active Users', icon: '👥', trend: 'up' },
            { value: '1.2M', label: 'Videos Created', icon: '🎬', trend: 'up' },
          ].map((item, i) => (
            <div key={i} style={{ ...styles.card('glass'), textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontSize: 48, fontWeight: 700, fontFamily: theme.fonts.header, color: theme.colors.primary, marginBottom: 5 }}>{item.value}</div>
              <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>{item.label}</div>
              <div style={{ marginTop: 10, color: theme.colors.accentGreen, fontSize: 16, fontWeight: 600 }}>↑ {item.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* StepCard */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>StepCard</h2>
        <p style={styles.sectionDesc}>Step-by-step instruction cards</p>
        
        <div style={styles.showcase}>
          {[
            { step: 1, title: 'Create Your Scene', text: 'Define your video structure with simple JSON' },
            { step: 2, title: 'Add Content', text: 'Insert text, images, and animations' },
            { step: 3, title: 'Render & Share', text: 'Export your video and share with the world' },
          ].map((item) => (
            <div key={item.step} style={styles.card('bordered')}>
              <div style={{ display: 'flex', gap: theme.spacing.cardPadding }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.cardBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>{item.step}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.header, marginBottom: 8 }}>{item.title}</div>
                  <div style={{ height: 1, backgroundColor: `${theme.colors.textMain}20`, margin: '10px 0' }} />
                  <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>{item.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FeatureCard ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>FeatureCard ✨ NEW</h2>
        <p style={styles.sectionDesc}>Icon + Title + Description + CTA button</p>
        
        <div style={styles.showcase}>
          {[
            { icon: '🚀', title: 'Lightning Fast', text: 'Create videos in minutes, not days', button: 'Get Started' },
            { icon: '🎨', title: 'Beautiful Design', text: 'Professional-quality output every time', button: 'Learn More' },
            { icon: '⚙️', title: 'Easy Config', text: 'JSON-driven flexibility and control', button: 'View Docs' },
          ].map((item, i) => (
            <div key={i} style={styles.card('default')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.cardPadding, alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: 80 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: theme.fonts.header, marginBottom: 10 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 15 }}>{item.text}</div>
                  <div style={styles.button('primary', 'md')}>{item.button}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TestimonialCard ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>TestimonialCard ✨ NEW</h2>
        <p style={styles.sectionDesc}>Avatar + Name + Quote + Rating</p>
        
        <div style={styles.showcase}>
          {[
            { name: 'Sarah Johnson', role: 'EdTech Director', quote: 'KnoMotion revolutionized how we create educational content. We went from weeks to hours!', rating: 5 },
            { name: 'Michael Chen', role: 'Content Creator', quote: 'The JSON-first approach makes it incredibly easy to scale our video production.', rating: 5 },
          ].map((item, i) => (
            <div key={i} style={styles.card('glass')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.cardPadding }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.cardBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 24,
                    border: `3px solid ${theme.colors.primary}`,
                    boxShadow: `0 0 0 3px ${theme.colors.cardBg}`,
                  }}>{item.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: theme.fonts.header }}>{item.name}</div>
                    <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>{item.role}</div>
                  </div>
                </div>
                <div style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  color: theme.colors.textMain,
                  paddingLeft: 20,
                  borderLeft: `3px solid ${theme.colors.primary}`,
                }}>"{item.quote}"</div>
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: 20 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} style={{ color: theme.colors.doodle }}>★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PricingCard ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>PricingCard ✨ NEW</h2>
        <p style={styles.sectionDesc}>Price + Features + CTA</p>
        
        <div style={styles.showcase}>
          {[
            { title: 'Starter', price: '$29/mo', features: ['10 videos/month', 'HD rendering', 'Basic templates', 'Email support'] },
            { title: 'Pro', price: '$99/mo', badge: 'Popular', features: ['Unlimited videos', '4K rendering', 'All templates', 'Priority support', 'Custom branding'], highlighted: true },
            { title: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee'] },
          ].map((item, i) => {
            const cardStyle = item.highlighted ? styles.card('glass') : styles.card('bordered');
            return (
              <div key={i} style={cardStyle}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.cardPadding,
                  textAlign: 'center',
                  ...(item.highlighted && {
                    border: `2px solid ${theme.colors.primary}`,
                    borderRadius: theme.radii.card,
                    padding: theme.spacing.cardPadding,
                  }),
                }}>
                  {item.badge && <div style={{ ...styles.badge('primary', 'sm'), alignSelf: 'center' }}>{item.badge}</div>}
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: theme.fonts.header }}>{item.title}</div>
                  <div style={{ fontSize: 48, fontWeight: 700, fontFamily: theme.fonts.marker, color: theme.colors.primary }}>{item.price}</div>
                  <div style={{ height: 1, backgroundColor: `${theme.colors.textMain}20` }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {item.features.map((feature, j) => (
                      <div key={j} style={{ fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span style={{ color: theme.colors.accentGreen }}>✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div style={styles.button('primary', 'lg')}>Get Started</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HeroWithCTA ✨ NEW */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>HeroWithCTA ✨ NEW</h2>
        <p style={styles.sectionDesc}>Hero section with call-to-action button</p>
        
        <div style={styles.showcase}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 30 }}>
            <span style={{ fontSize: 100 }}>🎬</span>
            <div>
              <div style={{ fontSize: 56, fontWeight: 700, fontFamily: theme.fonts.marker, color: theme.colors.primary, lineHeight: 1.2 }}>
                Create Amazing Videos
              </div>
              <div style={{ height: 3, width: 200, backgroundColor: theme.colors.primary, margin: '15px auto' }} />
              <div style={{ fontSize: 24, fontWeight: 400, fontFamily: theme.fonts.body, color: theme.colors.textSecondary, marginTop: 15 }}>
                JSON-first video engine for EdTech professionals
              </div>
              <div style={{ marginTop: 25 }}>
                <div style={styles.button('primary', 'lg')}>Start Creating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={{ fontSize: 48, fontWeight: 700, fontFamily: theme.fonts.marker, color: theme.colors.primary, marginBottom: 10 }}>
          KnoMotion Element Library
        </h1>
        <p style={{ fontSize: 18, color: theme.colors.textSecondary }}>
          Unified Admin Config - Review all elements and their variants
        </p>
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        <button
          style={{
            ...styles.navButton,
            ...(selectedTab === 'atoms' ? styles.navButtonActive : {}),
          }}
          onClick={() => setSelectedTab('atoms')}
        >
          Atomic Elements (14)
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(selectedTab === 'compositions' ? styles.navButtonActive : {}),
          }}
          onClick={() => setSelectedTab('compositions')}
        >
          Compositions (9)
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(selectedTab === 'all' ? styles.navButtonActive : {}),
          }}
          onClick={() => setSelectedTab('all')}
        >
          View All
        </button>
      </div>

      {/* Content */}
      {(selectedTab === 'atoms' || selectedTab === 'all') && renderAtomicElements()}
      {(selectedTab === 'compositions' || selectedTab === 'all') && renderCompositionElements()}

      {/* Footer */}
      <div style={{ 
        marginTop: 60, 
        padding: '30px 0', 
        borderTop: `2px solid ${theme.colors.textMain}10`,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 24, fontWeight: 700, color: theme.colors.primary, marginBottom: 15 }}>
          🎉 23 Elements Total!
        </p>
        <p style={{ fontSize: 16, color: theme.colors.textSecondary, marginBottom: 8 }}>
          ✅ 14 Atomic Elements + 9 Composition Elements
        </p>
        <p style={{ fontSize: 16, color: theme.colors.textSecondary, marginBottom: 8 }}>
          ✅ All elements follow KNODE_THEME and standardized prop schema
        </p>
        <p style={{ fontSize: 14, color: theme.colors.textSecondary }}>
          Ready for showcase video production! 🚀
        </p>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
};
