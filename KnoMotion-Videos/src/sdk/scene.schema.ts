import {z} from 'zod';



export const SceneSchema = z.object({

  schema_version: z.string(),

  template_id: z.string(),

  // v3/v4 fields (legacy)
  duration_s: z.number().positive().optional(),

  fps: z.number().positive().optional(),

  layout: z.object({canvas: z.object({w: z.number(), h: z.number()})}).optional(),

  timeline: z.array(z.object({

    t: z.number(),

    action: z.string(),

    target: z.string().optional(),

    duration: z.number().optional()

  })).optional().default([]),

  // v5.0 fields (Blueprint v5)
  beats: z.record(z.number()).optional(),

  meta: z.object({

    title: z.string().default(''),

    tags: z.array(z.string()).default([])

  }).optional(),

  style_tokens: z.object({

    mode: z.enum(['notebook', 'whiteboard']).optional(),

    colors: z.object({

      bg: z.string().optional(),

      accent: z.string().optional(),

      accent2: z.string().optional(),

      ink: z.string().optional(),

    }).optional(),

    fonts: z.object({

      // v5.0 format: object with family/size OR v5.1 format: simple strings
      title: z.union([
        z.object({family: z.string().optional(), size: z.number().optional()}),
        z.string()
      ]).optional(),

      body: z.union([
        z.object({family: z.string().optional(), size: z.number().optional()}),
        z.string()
      ]).optional(),
      
      header: z.string().optional(),
      secondary: z.string().optional(),
      
      // Size fields for agnostic format
      size_title: z.number().optional(),
      size_question: z.number().optional(),
      size_welcome: z.number().optional(),
      size_subtitle: z.number().optional(),

    }).optional(),

    motion: z.object({

      imperfection: z.number().min(0).max(1).optional(),

    }).optional(),

    texture: z.object({paper: z.boolean().optional(), chalk: z.number().min(0).max(1).optional()}).optional(),

    sfx: z.object({tick: z.boolean().optional()}).optional()

  }).optional(),

  // v5.0 fields (legacy - optional for backward compatibility)
  fill: z.object({

    texts: z.record(z.string()).optional().default({}),

    images: z.record(z.string()).optional().default({}),

  }).optional(),

  // v5.1 fields (agnostic template system)
  question: z.object({
    lines: z.array(z.object({
      text: z.string(),
      emphasis: z.enum(['normal', 'high', 'low']).optional()
    })),
    layout: z.object({
      arrangement: z.string().optional(),
      stagger: z.number().optional(),
      verticalSpacing: z.number().optional(),
      horizontalSpacing: z.number().optional(),
      basePosition: z.union([z.string(), z.object({
        grid: z.string().optional(),
        offset: z.object({ x: z.number(), y: z.number() }).optional(),
        x: z.union([z.string(), z.number()]).optional(),
        y: z.union([z.string(), z.number()]).optional()
      })]).optional(),
      centerStack: z.boolean().optional()
    }).optional(),
    animation: z.object({
      entrance: z.string().optional(),
      entranceDuration: z.number().optional(),
      entranceDistance: z.number().optional(),
      movePattern: z.string().optional(),
      emphasis: z.string().optional(),
      stagger: z.number().optional()
    }).optional()
  }).optional(),

  hero: z.object({
    type: z.enum(['image', 'svg', 'roughSVG', 'lottie', 'custom']),
    asset: z.string().optional(),
    position: z.union([z.string(), z.object({
      grid: z.string().optional(),
      offset: z.object({ x: z.number(), y: z.number() }).optional(),
      x: z.union([z.string(), z.number()]).optional(),
      y: z.union([z.string(), z.number()]).optional()
    })]).optional(),
    animation: z.object({
      entrance: z.string().optional(),
      entranceBeat: z.string().optional(),
      entranceDuration: z.number().optional()
    }).optional(),
    transforms: z.array(z.object({
      beat: z.string(),
      targetScale: z.number().optional(),
      targetPos: z.object({ x: z.number(), y: z.number() }).optional(),
      duration: z.number().optional(),
      rotation: z.number().optional()
    })).optional(),
    style: z.record(z.any()).optional(),
    colorMap: z.record(z.string()).optional(),
    alt: z.string().optional()
  }).optional(),

  welcome: z.object({
    text: z.string(),
    position: z.union([z.string(), z.object({
      grid: z.string().optional(),
      offset: z.object({ x: z.number(), y: z.number() }).optional()
    })]).optional(),
    effects: z.array(z.string()).optional()
  }).optional(),

  subtitle: z.object({
    text: z.string(),
    position: z.union([z.string(), z.object({
      grid: z.string().optional(),
      offset: z.object({ x: z.number(), y: z.number() }).optional()
    })]).optional()
  }).optional(),

  // Generic layers array (future extensibility)
  layers: z.array(z.object({
    id: z.string(),
    type: z.string(),
    position: z.union([z.string(), z.object({
      grid: z.string().optional(),
      offset: z.object({ x: z.number(), y: z.number() }).optional(),
      x: z.union([z.string(), z.number()]).optional(),
      y: z.union([z.string(), z.number()]).optional()
    })]).optional(),
    anim: z.array(z.any()).optional(),
    style: z.record(z.any()).optional()
  })).optional(),

  // Lottie animations
  lottie: z.array(z.object({
    id: z.string(),
    src: z.string(),
    pos: z.object({ x: z.number(), y: z.number() }).optional(),
    colorize: z.string().optional(),
    start: z.number().optional(),
    dur: z.number().optional()
  })).optional()

}).refine(
  (data) => {
    // Ensure either v5.0 format (fill) OR v5.1 format (question/hero/welcome/subtitle) is present
    const hasV5Legacy = data.fill !== undefined;
    const hasV5Agnostic = data.question !== undefined || data.hero !== undefined;
    
    return hasV5Legacy || hasV5Agnostic;
  },
  {
    message: "Scene must have either v5.0 format (fill) or v5.1 format (question/hero/welcome/subtitle)"
  }
);

export type SceneData = z.infer<typeof SceneSchema>;

/**
 * Detect schema version from scene data
 */
export const detectSchemaVersion = (scene: any): '5.0' | '5.1' | 'unknown' => {
  if (scene.schema_version === '5.1') return '5.1';
  if (scene.schema_version === '5.0') return '5.0';
  
  // Auto-detect based on fields
  const hasV5Agnostic = scene.question !== undefined || scene.hero !== undefined;
  if (hasV5Agnostic) return '5.1';
  
  const hasV5Legacy = scene.fill !== undefined;
  if (hasV5Legacy) return '5.0';
  
  return 'unknown';
};

/**
 * Check if scene is using agnostic template system (v5.1)
 */
export const isAgnosticScene = (scene: any): boolean => {
  return detectSchemaVersion(scene) === '5.1';
};

/**
 * Check if scene is using legacy format (v5.0)
 */
export const isLegacyScene = (scene: any): boolean => {
  return detectSchemaVersion(scene) === '5.0';
};
