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
          Atomic Elements (8)
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(selectedTab === 'compositions' ? styles.navButtonActive : {}),
          }}
          onClick={() => setSelectedTab('compositions')}
        >
          Compositions (5)
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
        <p style={{ fontSize: 16, color: theme.colors.textSecondary, marginBottom: 8 }}>
          ✅ All elements follow KNODE_THEME and standardized prop schema
        </p>
        <p style={{ fontSize: 14, color: theme.colors.textSecondary }}>
          Ready for showcase video production!
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
