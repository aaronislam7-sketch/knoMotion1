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

      title: z.object({family: z.string().optional(), size: z.number().optional()}).optional(),

      body:  z.object({family: z.string().optional(), size: z.number().optional()}).optional(),

    }).optional(),

    motion: z.object({

      imperfection: z.number().min(0).max(1).optional(),

    }).optional(),

    texture: z.object({paper: z.boolean().optional(), chalk: z.number().min(0).max(1).optional()}).optional(),

    sfx: z.object({tick: z.boolean().optional()}).optional()

  }).optional(),

  fill: z.object({

    texts: z.record(z.string()).optional().default({}),

    images: z.record(z.string()).optional().default({}),

  }),

});



export type SceneData = z.infer<typeof SceneSchema>;
