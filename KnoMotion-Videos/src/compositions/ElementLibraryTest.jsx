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
      <Text variant="display" size="xl" weight="bold" color="primary">
        Element Library Test (13 Elements)
      </Text>
      
      <Divider orientation="horizontal" thickness={3} color="primary" />

      {/* Atomic Elements Section */}
      <div>
        <Text variant="title" size="lg" weight="bold">
          Atomic Elements (8)
        </Text>
        
        {/* Row 1: Badge, Button, Icon */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20, alignItems: 'center' }}>
          <Badge variant="primary" size="md">Badge</Badge>
          <Badge variant="success" size="sm">Success</Badge>
          <Badge variant="warning" size="lg">Warning</Badge>
          
          <Button variant="primary" size="md">Button</Button>
          <Button variant="outline" size="sm">Outline</Button>
          
          <Icon size="md">🎨</Icon>
          <Icon size="lg" color="primary">⚡</Icon>
          
          {/* Indicator test */}
          <div style={{ position: 'relative', width: 60, height: 60 }}>
            <Icon size="xl">🔔</Icon>
            <Indicator variant="danger" pulse position="top-right" />
          </div>
        </div>

        {/* Row 2: Card */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <Card variant="default" size="sm" style={{ width: 200 }}>
            <Text variant="body" size="sm">Default Card</Text>
          </Card>
          <Card variant="bordered" size="md" style={{ width: 200 }}>
            <Text variant="body" size="sm">Bordered Card</Text>
          </Card>
          <Card variant="glass" size="lg" style={{ width: 200 }}>
            <Text variant="body" size="sm">Glass Card</Text>
          </Card>
        </div>

        {/* Row 3: Text variants */}
        <div style={{ marginTop: 20 }}>
          <Text variant="display" size="md" weight="bold">Display Text</Text>
          <Text variant="title" size="md">Title Text</Text>
          <Text variant="body" size="sm" color="textSecondary">Body text (secondary)</Text>
        </div>

        {/* Row 4: Progress */}
        <div style={{ marginTop: 20, width: '100%', maxWidth: 500 }}>
          <Progress value={75} variant="primary" size="md" />
          <div style={{ marginTop: 10 }}>
            <Progress value={50} variant="success" size="sm" />
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
        <Text variant="title" size="lg" weight="bold">
          Composition Elements (5)
        </Text>

        {/* Row 1: CardWithBadge, CardWithIcon */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <CardWithBadge 
            badge="New" 
            badgeVariant="success"
            badgePosition="top-right"
            cardVariant="glass"
            style={{ width: 250 }}
          >
            <Text variant="title" size="md" weight="bold">CardWithBadge</Text>
            <Text variant="body" size="sm">Card + Badge combo</Text>
          </CardWithBadge>

          <CardWithIcon
            icon="🚀"
            title="CardWithIcon"
            layout="horizontal"
            cardVariant="bordered"
            style={{ width: 250 }}
          >
            <Text variant="body" size="sm">Card + Icon + Text layout</Text>
          </CardWithIcon>
        </div>

        {/* Row 2: StepCard */}
        <div style={{ marginTop: 20, maxWidth: 500 }}>
          <StepCard 
            step={1}
            title="StepCard Component"
            cardVariant="bordered"
          >
            Step-by-step instruction card with number badge
          </StepCard>
        </div>

        {/* Row 3: StatCard */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <StatCard 
            value="98%"
            label="Success Rate"
            icon="⭐"
            trend="up"
            cardVariant="glass"
            style={{ width: 200 }}
          />
          <StatCard 
            value="250K"
            label="Users"
            icon="👥"
            trend="up"
            style={{ width: 200 }}
          />
        </div>

        {/* Row 4: HeroWithText */}
        <div style={{ marginTop: 20, maxWidth: 600 }}>
          <HeroWithText 
            hero="🎓"
            title="HeroWithText Component"
            subtitle="Hero section with title and subtitle"
            layout="horizontal"
          />
        </div>
      </div>

      <Divider orientation="horizontal" thickness={3} color="primary" style={{ marginTop: 20 }} />

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Text variant="body" size="sm" color="textSecondary">
          ✅ All 13 elements rendered successfully!
        </Text>
        <Text variant="body" size="xs" color="textSecondary" style={{ marginTop: 10 }}>
          8 Atoms + 5 Compositions | KNODE_THEME Applied | Animation-Ready
        </Text>
      </div>
    </AbsoluteFill>
  );
};
