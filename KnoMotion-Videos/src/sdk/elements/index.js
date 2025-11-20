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
// ATOMIC ELEMENTS (8)
// ========================================

export { Badge } from './atoms/Badge';
export { Button } from './atoms/Button';
export { Card } from './atoms/Card';
export { Divider } from './atoms/Divider';
export { Icon } from './atoms/Icon';
export { Indicator } from './atoms/Indicator';
export { Progress } from './atoms/Progress';
export { Text } from './atoms/Text';

// ========================================
// COMPOSITION ELEMENTS (5)
// ========================================

export { CardWithBadge } from './compositions/CardWithBadge';
export { CardWithIcon } from './compositions/CardWithIcon';
export { HeroWithText } from './compositions/HeroWithText';
export { StatCard } from './compositions/StatCard';
export { StepCard } from './compositions/StepCard';

// ========================================
// ELEMENT LIBRARY SUMMARY
// ========================================
// Total: 13 elements (8 atoms, 5 compositions)
//
// Atoms:
//   - Badge: Labels/tags with variants
//   - Button: Visual button elements (non-interactive)
//   - Card: Container cards with variants (default, bordered, glass)
//   - Divider: Horizontal/vertical separators
//   - Icon: Icons/emojis with animation support
//   - Indicator: Notification dots/badges
//   - Progress: Progress bars with animation
//   - Text: Themed text with typewriter support
//
// Compositions:
//   - CardWithBadge: Card + Badge combo
//   - CardWithIcon: Card + Icon + Text layout
//   - HeroWithText: Hero section with title/subtitle
//   - StatCard: Statistics display card
//   - StepCard: Step-by-step instruction card
//
// All elements:
//   ✅ Use KNODE_THEME (no hardcoded colors/fonts)
//   ✅ Support animation configs
//   ✅ Consistent API (variant, size, style props)
//   ✅ Fully documented with JSDoc
//   ✅ Exported via this index
// ========================================
