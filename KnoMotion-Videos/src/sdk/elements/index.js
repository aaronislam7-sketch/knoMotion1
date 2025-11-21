/**
 * KnoMotion Element Library
 * 
 * Atomic and Composition elements following KNODE_THEME
 * All elements are wrapped, themed, and animation-ready
 * 
 * CRITICAL: Never import external libraries (DaisyUI, etc.) directly!
 * Always import from this index: `import { Badge, Card } from '../../sdk/elements'`
 */

// ========================================
// ATOMIC ELEMENTS (14)
// ========================================

// Original Atoms (8)
export { Badge } from './atoms/Badge';
export { Button } from './atoms/Button';
export { Card } from './atoms/Card';
export { Divider } from './atoms/Divider';
export { Icon } from './atoms/Icon';
export { Indicator } from './atoms/Indicator';
export { Progress } from './atoms/Progress';
export { Text } from './atoms/Text';

// NEW Atoms - Batch 1 (6)
export { Alert } from './atoms/Alert';
export { Avatar } from './atoms/Avatar';
export { Loading } from './atoms/Loading';
export { Skeleton } from './atoms/Skeleton';
export { Rating } from './atoms/Rating';
export { RadialProgress } from './atoms/RadialProgress';

// ========================================
// COMPOSITION ELEMENTS (9)
// ========================================

// Original Compositions (5)
export { CardWithBadge } from './compositions/CardWithBadge';
export { CardWithIcon } from './compositions/CardWithIcon';
export { HeroWithText } from './compositions/HeroWithText';
export { StatCard } from './compositions/StatCard';
export { StepCard } from './compositions/StepCard';

// NEW Compositions - Batch 4 (4)
export { FeatureCard } from './compositions/FeatureCard';
export { TestimonialCard } from './compositions/TestimonialCard';
export { PricingCard } from './compositions/PricingCard';
export { HeroWithCTA } from './compositions/HeroWithCTA';

// ========================================
// ELEMENT LIBRARY SUMMARY
// ========================================
// Total: 23 elements (14 atoms, 9 compositions)
//
// Atoms (14):
//   - Badge: Labels/tags with variants
//   - Button: Visual button elements (non-interactive)
//   - Card: Container cards with variants (default, bordered, glass)
//   - Divider: Horizontal/vertical separators
//   - Icon: Icons/emojis with animation support
//   - Indicator: Notification dots/badges
//   - Progress: Progress bars with animation
//   - Text: Themed text with typewriter support
//   - Alert: Info/success/warning/error message boxes ✨ NEW
//   - Avatar: User profile images with status indicators ✨ NEW
//   - Loading: Animated spinners/dots/rings ✨ NEW
//   - Skeleton: Loading state placeholders ✨ NEW
//   - Rating: Star rating displays ✨ NEW
//   - RadialProgress: Circular progress indicators ✨ NEW
//
// Compositions (9):
//   - CardWithBadge: Card + Badge combo
//   - CardWithIcon: Card + Icon + Text layout
//   - HeroWithText: Hero section with title/subtitle
//   - StatCard: Statistics display card
//   - StepCard: Step-by-step instruction card
//   - FeatureCard: Icon + Title + Description + CTA ✨ NEW
//   - TestimonialCard: Avatar + Name + Quote + Rating ✨ NEW
//   - PricingCard: Price + Features + CTA ✨ NEW
//   - HeroWithCTA: Hero + Title + Subtitle + Button ✨ NEW
//
// All elements:
//   ✅ Use KNODE_THEME (no hardcoded colors/fonts)
//   ✅ Support animation configs
//   ✅ Consistent API (variant, size, style props)
//   ✅ Fully documented with JSDoc
//   ✅ Exported via this index
// ========================================
