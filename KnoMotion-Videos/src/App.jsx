// import { UnifiedAdminConfig } from './components/UnifiedAdminConfig';
import { ShowcasePreview } from './admin/ShowcasePreview';

/**
 * KnoMotion Videos - Main Application
 * 
 * TEMPORARY: Showing Showcase Preview for Phase 4 testing
 * 
 * Default entry point: Remotion Video Previewer (UnifiedAdminConfig)
 * - Video composition previewer with Remotion Player
 * - Full video controls and timeline
 * - Production-ready preview environment
 * 
 * Other views:
 * - Element showcase: /admin/ElementShowcase.jsx for design review
 * - Showcase preview: /admin/ShowcasePreview.jsx for QA (CURRENTLY ACTIVE)
 */
export default function App() {
  // return <UnifiedAdminConfig />; // Default view
  return <ShowcasePreview />; // Phase 4 testing
}
