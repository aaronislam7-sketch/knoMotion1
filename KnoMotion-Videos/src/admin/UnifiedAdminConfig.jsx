import React, { useState } from 'react';
import { 
  Badge, 
  Button, 
  Card, 
  Divider, 
  Icon, 
  Indicator, 
  Progress, 
  Text,
  CardWithBadge,
  CardWithIcon,
  HeroWithText,
  StatCard,
  StepCard,
} from '../sdk/elements';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

/**
 * UnifiedAdminConfig - Standalone showcase page for all elements
 * No Remotion required - pure React for easy review and feedback
 */
export const UnifiedAdminConfig = () => {
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
      fontSize: 24,
      fontWeight: 700,
      fontFamily: theme.fonts.header,
      color: theme.colors.textMain,
      marginBottom: '10px',
    },
    sectionDesc: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: '20px',
    },
    showcase: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginBottom: '40px',
    },
    demoBox: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: theme.radii.card,
      border: `1px solid ${theme.colors.textMain}10`,
    },
    demoTitle: {
      fontSize: 16,
      fontWeight: 600,
      fontFamily: theme.fonts.header,
      color: theme.colors.textMain,
      marginBottom: '15px',
    },
    demoContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    variantRow: {
      display: 'flex',
      gap: '10px',
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
                <Badge text="Default" variant="default" />
                <Badge text="Primary" variant="primary" />
                <Badge text="Success" variant="success" />
                <Badge text="Warning" variant="warning" />
                <Badge text="Danger" variant="danger" />
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <Badge text="Small" variant="primary" size="sm" />
                <Badge text="Medium" variant="primary" size="md" />
                <Badge text="Large" variant="primary" size="lg" />
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
                <Button text="Default" variant="default" size="md" />
                <Button text="Primary" variant="primary" size="md" />
                <Button text="Success" variant="success" size="md" />
                <Button text="Outline" variant="outline" size="md" />
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>With Icons</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <Button text="With Icon" iconRef="🚀" variant="primary" size="md" />
                <Button text="Download" iconRef="⬇️" variant="success" size="md" />
                <Button text="Settings" iconRef="⚙️" variant="outline" size="md" />
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <Button text="Small" variant="primary" size="sm" />
                <Button text="Medium" variant="primary" size="md" />
                <Button text="Large" variant="primary" size="lg" />
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
          <Card variant="default" size="md" style={{ width: '100%' }}>
            <Text text="Default Card" variant="title" size="md" weight="bold" />
            <Text text="Standard card with shadow" variant="body" size="sm" color="textSecondary" style={{ marginTop: 8 }} />
          </Card>

          <Card variant="bordered" size="md" style={{ width: '100%' }}>
            <Text text="Bordered Card" variant="title" size="md" weight="bold" />
            <Text text="Card with border, no shadow" variant="body" size="sm" color="textSecondary" style={{ marginTop: 8 }} />
          </Card>

          <Card variant="glass" size="md" style={{ width: '100%' }}>
            <Text text="Glass Card" variant="title" size="md" weight="bold" />
            <Text text="Glassmorphic effect with blur" variant="body" size="sm" color="textSecondary" style={{ marginTop: 8 }} />
          </Card>
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
              <Text text="Display Text" variant="display" size="md" weight="bold" />
              <Text text="Title Text" variant="title" size="md" weight="bold" />
              <Text text="Body Text" variant="body" size="md" />
              <Text text="Accent Text" variant="accent" size="md" />
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <Text text="Extra Small (xs)" variant="body" size="xs" />
              <Text text="Small (sm)" variant="body" size="sm" />
              <Text text="Medium (md)" variant="body" size="md" />
              <Text text="Large (lg)" variant="body" size="lg" />
              <Text text="Extra Large (xl)" variant="body" size="xl" />
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Weights</div>
            <div style={styles.demoContent}>
              <Text text="Normal Weight" variant="body" size="md" weight="normal" />
              <Text text="Medium Weight" variant="body" size="md" weight="medium" />
              <Text text="Bold Weight" variant="body" size="md" weight="bold" />
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
                <Icon iconRef="🎨" size="sm" />
                <Icon iconRef="🎨" size="md" />
                <Icon iconRef="🎨" size="lg" />
                <Icon iconRef="🎨" size="xl" />
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Different Icons</div>
            <div style={styles.demoContent}>
              <div style={styles.variantRow}>
                <Icon iconRef="🚀" size="lg" />
                <Icon iconRef="⚡" size="lg" color="primary" />
                <Icon iconRef="🎓" size="lg" />
                <Icon iconRef="🎯" size="lg" />
                <Icon iconRef="💡" size="lg" />
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
              <Progress value={75} label="Primary Progress (75%)" variant="primary" size="md" />
              <Progress value={50} label="Success Progress (50%)" variant="success" size="md" />
              <Progress value={30} label="Warning Progress (30%)" variant="warning" size="md" />
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Sizes</div>
            <div style={styles.demoContent}>
              <Progress value={60} label="Small" variant="primary" size="sm" />
              <Progress value={60} label="Medium" variant="primary" size="md" />
              <Progress value={60} label="Large" variant="primary" size="lg" />
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
              <div style={styles.label}>Solid</div>
              <Divider orientation="horizontal" variant="solid" thickness={2} />
              
              <div style={styles.label}>Dashed</div>
              <Divider orientation="horizontal" variant="dashed" thickness={2} />
              
              <div style={styles.label}>Dotted</div>
              <Divider orientation="horizontal" variant="dotted" thickness={2} />
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Colored</div>
            <div style={styles.demoContent}>
              <Divider orientation="horizontal" variant="solid" thickness={3} color="primary" />
              <Text text="Primary color divider" variant="body" size="xs" color="textSecondary" style={{ marginTop: 5 }} />
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
                <div style={{ position: 'relative', width: 60, height: 60, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  <Indicator variant="primary" size="md" position="top-right" />
                </div>
                <div style={{ position: 'relative', width: 60, height: 60, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  <Indicator variant="success" size="md" position="top-right" />
                </div>
                <div style={{ position: 'relative', width: 60, height: 60, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  <Indicator variant="warning" size="md" position="top-right" />
                </div>
                <div style={{ position: 'relative', width: 60, height: 60, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  <Indicator variant="danger" size="md" position="top-right" />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>With Icon</div>
            <div style={styles.demoContent}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Icon iconRef="🔔" size="xl" />
                <Indicator variant="danger" pulse position="top-right" />
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
          <CardWithBadge 
            badgeText="New" 
            badgeVariant="success"
            badgePosition="top-right"
            cardVariant="default"
          >
            <Text text="Featured Content" variant="title" size="md" weight="bold" />
            <Text text="Card with badge in top-right" variant="body" size="sm" color="textSecondary" style={{ marginTop: 8 }} />
          </CardWithBadge>

          <CardWithBadge 
            badgeText="Hot" 
            badgeVariant="danger"
            badgePosition="top-left"
            cardVariant="glass"
          >
            <Text text="Trending Item" variant="title" size="md" weight="bold" />
            <Text text="Card with badge in top-left" variant="body" size="sm" color="textSecondary" style={{ marginTop: 8 }} />
          </CardWithBadge>

          <CardWithBadge 
            badgeText="Sale" 
            badgeVariant="warning"
            badgePosition="bottom-right"
            cardVariant="bordered"
          >
            <Text text="Special Offer" variant="title" size="md" weight="bold" />
            <Text text="Card with badge in bottom-right" variant="body" size="sm" color="textSecondary" style={{ marginTop: 8 }} />
          </CardWithBadge>
        </div>
      </div>

      {/* CardWithIcon */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>CardWithIcon</h2>
        <p style={styles.sectionDesc}>Card with icon and text layout</p>
        
        <div style={styles.showcase}>
          <CardWithIcon
            iconRef="🚀"
            title="Fast Performance"
            text="Lightning-fast rendering and delivery"
            layout="horizontal"
            cardVariant="default"
          />

          <CardWithIcon
            iconRef="🎨"
            title="Beautiful Design"
            text="Stunning visuals that engage learners"
            layout="horizontal"
            cardVariant="glass"
          />

          <CardWithIcon
            iconRef="⚙️"
            title="Easy Configuration"
            text="Simple JSON-based setup"
            layout="vertical"
            cardVariant="bordered"
          />
        </div>
      </div>

      {/* HeroWithText */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>HeroWithText</h2>
        <p style={styles.sectionDesc}>Hero section with icon/image and text</p>
        
        <div style={styles.showcase}>
          <div style={{ gridColumn: '1 / -1' }}>
            <HeroWithText 
              heroRef="🎓"
              title="Learn Anything, Anywhere"
              subtitle="Powered by KnoMotion Video Engine"
              layout="vertical"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <HeroWithText 
              heroRef="⚡"
              title="Lightning Fast"
              subtitle="Create videos in minutes, not days"
              layout="horizontal"
            />
          </div>
        </div>
      </div>

      {/* StatCard */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>StatCard</h2>
        <p style={styles.sectionDesc}>Statistics display with trends</p>
        
        <div style={styles.showcase}>
          <StatCard 
            value="98%"
            label="Success Rate"
            iconRef="⭐"
            trend="up"
            cardVariant="default"
          />

          <StatCard 
            value="250K"
            label="Active Users"
            iconRef="👥"
            trend="up"
            cardVariant="glass"
          />

          <StatCard 
            value="1.2M"
            label="Videos Created"
            iconRef="🎬"
            trend="up"
            cardVariant="bordered"
          />
        </div>
      </div>

      {/* StepCard */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>StepCard</h2>
        <p style={styles.sectionDesc}>Step-by-step instruction cards</p>
        
        <div style={styles.showcase}>
          <StepCard 
            step={1}
            title="Create Your Scene"
            text="Define your video structure with simple JSON"
            cardVariant="bordered"
          />

          <StepCard 
            step={2}
            title="Add Content"
            text="Insert text, images, and animations"
            cardVariant="bordered"
          />

          <StepCard 
            step={3}
            title="Render & Share"
            text="Export your video and share with the world"
            cardVariant="bordered"
          />
        </div>
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Text text="KnoMotion Element Library" variant="display" size="xl" weight="bold" color="primary" />
        <Text text="Unified Admin Config - Review all elements and their variants" variant="body" size="md" color="textSecondary" style={{ marginTop: 10 }} />
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
        <Text text="✅ All elements follow KNODE_THEME and standardized prop schema" variant="body" size="sm" color="textSecondary" />
        <Text text="Ready for showcase video production!" variant="body" size="xs" color="textSecondary" style={{ marginTop: 8 }} />
      </div>
    </div>
  );
};
