import React from 'react';
import { AbsoluteFill } from 'remotion';
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
 * ElementLibraryTest - Test composition for all 13 elements
 * This composition verifies that all elements render correctly
 */
export const ElementLibraryTest = () => {
  const theme = KNODE_THEME;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <Text text="Element Library Test (13 Elements)" variant="display" size="xl" weight="bold" color="primary" />
      
      <Divider orientation="horizontal" thickness={3} color="primary" />

      {/* Atomic Elements Section */}
      <div>
        <Text text="Atomic Elements (8)" variant="title" size="lg" weight="bold" />
        
        {/* Row 1: Badge, Button, Icon */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20, alignItems: 'center' }}>
          <Badge text="Badge" variant="primary" size="md" />
          <Badge text="Success" variant="success" size="sm" />
          <Badge text="Warning" variant="warning" size="lg" />
          
          <Button text="Button" variant="primary" size="md" />
          <Button text="Outline" variant="outline" size="sm" />
          <Button text="With Icon" iconRef="🚀" variant="primary" size="md" />
          
          <Icon iconRef="🎨" size="md" />
          <Icon iconRef="⚡" size="lg" color="primary" />
          
          {/* Indicator test */}
          <div style={{ position: 'relative', width: 60, height: 60 }}>
            <Icon iconRef="🔔" size="xl" />
            <Indicator variant="danger" pulse position="top-right" />
          </div>
        </div>

        {/* Row 2: Card */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <Card variant="default" size="sm" style={{ width: 200 }}>
            <Text text="Default Card" variant="body" size="sm" />
          </Card>
          <Card variant="bordered" size="md" style={{ width: 200 }}>
            <Text text="Bordered Card" variant="body" size="sm" />
          </Card>
          <Card variant="glass" size="lg" style={{ width: 200 }}>
            <Text text="Glass Card" variant="body" size="sm" />
          </Card>
        </div>

        {/* Row 3: Text variants */}
        <div style={{ marginTop: 20 }}>
          <Text text="Display Text" variant="display" size="md" weight="bold" />
          <Text text="Title Text" variant="title" size="md" />
          <Text text="Body text (secondary)" variant="body" size="sm" color="textSecondary" />
        </div>

        {/* Row 4: Progress */}
        <div style={{ marginTop: 20, width: '100%', maxWidth: 500 }}>
          <Progress value={75} label="Loading Progress (75%)" variant="primary" size="md" />
          <div style={{ marginTop: 15 }}>
            <Progress value={50} label="Success Rate" variant="success" size="sm" />
          </div>
        </div>

        {/* Row 5: Dividers */}
        <div style={{ marginTop: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
          <Divider orientation="horizontal" variant="solid" thickness={2} length={100} />
          <Divider orientation="horizontal" variant="dashed" thickness={2} length={100} />
          <Divider orientation="horizontal" variant="dotted" thickness={2} length={100} />
        </div>
      </div>

      <Divider orientation="horizontal" thickness={2} style={{ margin: '20px 0' }} />

      {/* Composition Elements Section */}
      <div>
        <Text text="Composition Elements (5)" variant="title" size="lg" weight="bold" />

        {/* Row 1: CardWithBadge, CardWithIcon */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <CardWithBadge 
            badgeText="New" 
            badgeVariant="success"
            badgePosition="top-right"
            cardVariant="glass"
            style={{ width: 250 }}
          >
            <Text text="CardWithBadge" variant="title" size="md" weight="bold" />
            <Text text="Card + Badge combo" variant="body" size="sm" />
          </CardWithBadge>

          <CardWithIcon
            iconRef="🚀"
            title="CardWithIcon"
            text="Card + Icon + Text layout"
            layout="horizontal"
            cardVariant="bordered"
            style={{ width: 250 }}
          />
        </div>

        {/* Row 2: StepCard */}
        <div style={{ marginTop: 20, maxWidth: 500 }}>
          <StepCard 
            step={1}
            title="StepCard Component"
            text="Step-by-step instruction card with number badge"
            cardVariant="bordered"
          />
        </div>

        {/* Row 3: StatCard */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <StatCard 
            value="98%"
            label="Success Rate"
            iconRef="⭐"
            trend="up"
            cardVariant="glass"
            style={{ width: 200 }}
          />
          <StatCard 
            value="250K"
            label="Users"
            iconRef="👥"
            trend="up"
            style={{ width: 200 }}
          />
        </div>

        {/* Row 4: HeroWithText */}
        <div style={{ marginTop: 20, maxWidth: 600 }}>
          <HeroWithText 
            heroRef="🎓"
            title="HeroWithText Component"
            subtitle="Hero section with title and subtitle"
            layout="horizontal"
          />
        </div>
      </div>

      <Divider orientation="horizontal" thickness={3} color="primary" style={{ marginTop: 20 }} />

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Text 
          text="✅ All 13 elements rendered successfully!" 
          variant="body" 
          size="sm" 
          color="textSecondary" 
        />
        <Text 
          text="8 Atoms + 5 Compositions | KNODE_THEME Applied | Animation-Ready | Standardized Props ✨" 
          variant="body" 
          size="xs" 
          color="textSecondary" 
          style={{ marginTop: 10 }} 
        />
      </div>
    </AbsoluteFill>
  );
};
