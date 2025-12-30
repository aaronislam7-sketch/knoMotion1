/**
 * Image Library
 * 
 * Centralized repository of images used across scenes.
 * Each image has:
 * - imageId: Unique identifier
 * - description: What the image represents
 * - url: Source URL for the image
 * 
 * Usage in JSON:
 * Instead of: "images": { "icon1": "https://..." }
 * Use: "images": { "icon1": "img_lightbulb" }
 */

export const IMAGE_LIBRARY = {
  // Icons - Ideas & Learning
  img_lightbulb: {
    imageId: 'img_lightbulb',
    description: 'Light bulb icon representing ideas and innovation',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=lightbulb&backgroundColor=4a9c3b'
  },
  img_brain: {
    imageId: 'img_brain',
    description: 'Brain icon representing thinking and cognition',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=brain&backgroundColor=9b59b6'
  },
  img_book: {
    imageId: 'img_book',
    description: 'Book icon representing knowledge and learning',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=book&backgroundColor=3498db'
  },
  img_question: {
    imageId: 'img_question',
    description: 'Question mark icon for curiosity and inquiry',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=question&backgroundColor=e74c3c'
  },

  // Icons - Emotions & Connections
  img_heart: {
    imageId: 'img_heart',
    description: 'Heart icon representing emotion and connection',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=heart&backgroundColor=e74c3c'
  },
  img_star: {
    imageId: 'img_star',
    description: 'Star icon for achievement and excellence',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=star&backgroundColor=f39c12'
  },
  img_smile: {
    imageId: 'img_smile',
    description: 'Smile icon for positivity and happiness',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=smile&backgroundColor=86BC25'
  },
  img_network: {
    imageId: 'img_network',
    description: 'Network icon representing connections and sharing',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=network&backgroundColor=3498db'
  },

  // Icons - Time & Process
  img_clock: {
    imageId: 'img_clock',
    description: 'Clock icon representing time and timing',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=clock&backgroundColor=f39c12'
  },
  img_calendar: {
    imageId: 'img_calendar',
    description: 'Calendar icon for scheduling and planning',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=calendar&backgroundColor=16a085'
  },
  img_rocket: {
    imageId: 'img_rocket',
    description: 'Rocket icon for launch and progress',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=rocket&backgroundColor=e67e22'
  },
  img_target: {
    imageId: 'img_target',
    description: 'Target icon for goals and objectives',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=target&backgroundColor=c0392b'
  },

  // Icons - Tools & Actions
  img_tool: {
    imageId: 'img_tool',
    description: 'Tool icon representing implementation and doing',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=tool&backgroundColor=7f8c8d'
  },
  img_pencil: {
    imageId: 'img_pencil',
    description: 'Pencil icon for writing and creating',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=pencil&backgroundColor=34495e'
  },
  img_checkmark: {
    imageId: 'img_checkmark',
    description: 'Checkmark icon for completion and success',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=check&backgroundColor=27ae60'
  },
  img_puzzle: {
    imageId: 'img_puzzle',
    description: 'Puzzle piece for problem-solving',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=puzzle&backgroundColor=8e44ad'
  },

  // Icons - Reflection & Growth
  img_mirror: {
    imageId: 'img_mirror',
    description: 'Mirror icon for reflection and self-awareness',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=mirror&backgroundColor=95a5a6'
  },
  img_plant: {
    imageId: 'img_plant',
    description: 'Plant icon representing growth and development',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=plant&backgroundColor=86BC25'
  },
  img_medal: {
    imageId: 'img_medal',
    description: 'Medal icon for achievement and recognition',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=medal&backgroundColor=f1c40f'
  },
  img_trophy: {
    imageId: 'img_trophy',
    description: 'Trophy for accomplishment and mastery',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=trophy&backgroundColor=f39c12'
  },

  // Emojis & Symbols
  img_sparkle: {
    imageId: 'img_sparkle',
    description: 'Sparkle/magic effect',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=sparkle&backgroundColor=732282'
  },
  img_arrow: {
    imageId: 'img_arrow',
    description: 'Arrow for direction and flow',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=arrow&backgroundColor=2c3e50'
  },

  // ==================== EXPANDED LIBRARY (50+ Additional Images) ====================

  // Science & Discovery
  img_atom: {
    imageId: 'img_atom',
    description: 'Atom icon for science and physics',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=atom&backgroundColor=3498db'
  },
  img_microscope: {
    imageId: 'img_microscope',
    description: 'Microscope for scientific investigation',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=microscope&backgroundColor=16a085'
  },
  img_telescope: {
    imageId: 'img_telescope',
    description: 'Telescope for astronomy and vision',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=telescope&backgroundColor=34495e'
  },
  img_dna: {
    imageId: 'img_dna',
    description: 'DNA helix for genetics and biology',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=dna&backgroundColor=9b59b6'
  },
  img_beaker: {
    imageId: 'img_beaker',
    description: 'Chemistry beaker for experiments',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=beaker&backgroundColor=e67e22'
  },

  // Technology & Digital
  img_chip: {
    imageId: 'img_chip',
    description: 'Computer chip for technology',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=chip&backgroundColor=2c3e50'
  },
  img_code: {
    imageId: 'img_code',
    description: 'Code brackets for programming',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=code&backgroundColor=27ae60'
  },
  img_database: {
    imageId: 'img_database',
    description: 'Database for data storage',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=database&backgroundColor=3498db'
  },
  img_wifi: {
    imageId: 'img_wifi',
    description: 'WiFi signal for connectivity',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=wifi&backgroundColor=1abc9c'
  },
  img_cloud: {
    imageId: 'img_cloud',
    description: 'Cloud for cloud computing',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=cloud&backgroundColor=95a5a6'
  },

  // Communication & Social
  img_megaphone: {
    imageId: 'img_megaphone',
    description: 'Megaphone for announcements',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=megaphone&backgroundColor=e74c3c'
  },
  img_speech: {
    imageId: 'img_speech',
    description: 'Speech bubble for communication',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=speech&backgroundColor=3498db'
  },
  img_handshake: {
    imageId: 'img_handshake',
    description: 'Handshake for agreement and partnership',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=handshake&backgroundColor=16a085'
  },
  img_people: {
    imageId: 'img_people',
    description: 'Group of people for community',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=people&backgroundColor=9b59b6'
  },
  img_globe: {
    imageId: 'img_globe',
    description: 'Globe for global reach',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=globe&backgroundColor=3498db'
  },

  // Business & Finance
  img_chart: {
    imageId: 'img_chart',
    description: 'Chart for data and analytics',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=chart&backgroundColor=27ae60'
  },
  img_money: {
    imageId: 'img_money',
    description: 'Money/dollar sign for finance',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=money&backgroundColor=f39c12'
  },
  img_briefcase: {
    imageId: 'img_briefcase',
    description: 'Briefcase for business and work',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=briefcase&backgroundColor=34495e'
  },
  img_graph: {
    imageId: 'img_graph',
    description: 'Line graph for trends',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=graph&backgroundColor=16a085'
  },
  img_pie: {
    imageId: 'img_pie',
    description: 'Pie chart for proportions',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=pie&backgroundColor=9b59b6'
  },

  // Education & Learning
  img_graduation: {
    imageId: 'img_graduation',
    description: 'Graduation cap for education',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=graduation&backgroundColor=2c3e50'
  },
  img_teacher: {
    imageId: 'img_teacher',
    description: 'Teacher/instructor icon',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=teacher&backgroundColor=3498db'
  },
  img_notebook: {
    imageId: 'img_notebook',
    description: 'Notebook for notes and learning',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=notebook&backgroundColor=e67e22'
  },
  img_library: {
    imageId: 'img_library',
    description: 'Library or bookshelf',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=library&backgroundColor=8e44ad'
  },
  img_certificate: {
    imageId: 'img_certificate',
    description: 'Certificate for achievement',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=certificate&backgroundColor=f1c40f'
  },

  // Nature & Environment
  img_tree: {
    imageId: 'img_tree',
    description: 'Tree for nature and growth',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=tree&backgroundColor=27ae60'
  },
  img_leaf: {
    imageId: 'img_leaf',
    description: 'Leaf for sustainability',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=leaf&backgroundColor=86BC25'
  },
  img_sun: {
    imageId: 'img_sun',
    description: 'Sun for energy and brightness',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=sun&backgroundColor=f39c12'
  },
  img_moon: {
    imageId: 'img_moon',
    description: 'Moon for night and cycles',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=moon&backgroundColor=34495e'
  },
  img_water: {
    imageId: 'img_water',
    description: 'Water drop for hydration',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=water&backgroundColor=3498db'
  },

  // Health & Wellness
  img_fitness: {
    imageId: 'img_fitness',
    description: 'Dumbbell for fitness',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=fitness&backgroundColor=e74c3c'
  },
  img_apple: {
    imageId: 'img_apple',
    description: 'Apple for health and nutrition',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=apple&backgroundColor=e74c3c'
  },
  img_medkit: {
    imageId: 'img_medkit',
    description: 'Medical kit for healthcare',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=medkit&backgroundColor=27ae60'
  },
  img_heartbeat: {
    imageId: 'img_heartbeat',
    description: 'Heartbeat line for vitality',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=heartbeat&backgroundColor=e74c3c'
  },
  img_meditation: {
    imageId: 'img_meditation',
    description: 'Meditation for mindfulness',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=meditation&backgroundColor=9b59b6'
  },

  // Creative & Arts
  img_palette: {
    imageId: 'img_palette',
    description: 'Paint palette for creativity',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=palette&backgroundColor=e67e22'
  },
  img_music: {
    imageId: 'img_music',
    description: 'Music note for audio',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=music&backgroundColor=9b59b6'
  },
  img_camera: {
    imageId: 'img_camera',
    description: 'Camera for photography',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=camera&backgroundColor=34495e'
  },
  img_film: {
    imageId: 'img_film',
    description: 'Film reel for video',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=film&backgroundColor=2c3e50'
  },
  img_canvas: {
    imageId: 'img_canvas',
    description: 'Canvas for painting',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=canvas&backgroundColor=ecf0f1'
  },

  // Food & Cooking
  img_chef: {
    imageId: 'img_chef',
    description: 'Chef hat for cooking',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=chef&backgroundColor=ecf0f1'
  },
  img_coffee: {
    imageId: 'img_coffee',
    description: 'Coffee cup for energy',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=coffee&backgroundColor=795548'
  },
  img_utensils: {
    imageId: 'img_utensils',
    description: 'Fork and knife for dining',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=utensils&backgroundColor=95a5a6'
  },
  img_pizza: {
    imageId: 'img_pizza',
    description: 'Pizza slice for food',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=pizza&backgroundColor=e74c3c'
  },

  // Transportation & Travel
  img_plane: {
    imageId: 'img_plane',
    description: 'Airplane for travel',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=plane&backgroundColor=3498db'
  },
  img_car: {
    imageId: 'img_car',
    description: 'Car for transportation',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=car&backgroundColor=e74c3c'
  },
  img_bicycle: {
    imageId: 'img_bicycle',
    description: 'Bicycle for cycling',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=bicycle&backgroundColor=27ae60'
  },
  img_compass: {
    imageId: 'img_compass',
    description: 'Compass for navigation',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=compass&backgroundColor=34495e'
  },
  img_map: {
    imageId: 'img_map',
    description: 'Map for location',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=map&backgroundColor=16a085'
  },

  // Security & Protection
  img_shield: {
    imageId: 'img_shield',
    description: 'Shield for protection',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=shield&backgroundColor=3498db'
  },
  img_lock: {
    imageId: 'img_lock',
    description: 'Lock for security',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=lock&backgroundColor=34495e'
  },
  img_key: {
    imageId: 'img_key',
    description: 'Key for access',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=key&backgroundColor=f39c12'
  },
  img_safe: {
    imageId: 'img_safe',
    description: 'Safe for storing valuables',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=safe&backgroundColor=7f8c8d'
  },

  // Emotions & Expressions
  img_celebrate: {
    imageId: 'img_celebrate',
    description: 'Party popper for celebration',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=celebrate&backgroundColor=f39c12'
  },
  img_thinking: {
    imageId: 'img_thinking',
    description: 'Thinking face for contemplation',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=thinking&backgroundColor=95a5a6'
  },
  img_surprised: {
    imageId: 'img_surprised',
    description: 'Surprised expression',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=surprised&backgroundColor=f39c12'
  },
  img_thumbsup: {
    imageId: 'img_thumbsup',
    description: 'Thumbs up for approval',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=thumbsup&backgroundColor=27ae60'
  },

  // Abstract Concepts
  img_infinity: {
    imageId: 'img_infinity',
    description: 'Infinity symbol for limitless',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=infinity&backgroundColor=9b59b6'
  },
  img_balance: {
    imageId: 'img_balance',
    description: 'Balance scales for equilibrium',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=balance&backgroundColor=34495e'
  },
  img_magnet: {
    imageId: 'img_magnet',
    description: 'Magnet for attraction',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=magnet&backgroundColor=e74c3c'
  },
  img_gear: {
    imageId: 'img_gear',
    description: 'Gear for settings and mechanics',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=gear&backgroundColor=7f8c8d'
  },
  img_lightning: {
    imageId: 'img_lightning',
    description: 'Lightning bolt for speed and energy',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=lightning&backgroundColor=f39c12'
  },
  img_fire: {
    imageId: 'img_fire',
    description: 'Fire for passion and intensity',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=fire&backgroundColor=e74c3c'
  },
  img_snowflake: {
    imageId: 'img_snowflake',
    description: 'Snowflake for uniqueness',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=snowflake&backgroundColor=3498db'
  },
  img_diamond: {
    imageId: 'img_diamond',
    description: 'Diamond for value and clarity',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=diamond&backgroundColor=9b59b6'
  }
};

/**
 * Get image URL by imageId
 * @param {string} imageId - The image identifier
 * @returns {string} The image URL or a placeholder if not found
 */
export const getImageUrl = (imageId) => {
  const image = IMAGE_LIBRARY[imageId];
  if (!image) {
    console.warn(`Image not found in library: ${imageId}`);
    return `https://via.placeholder.com/100?text=${imageId}`;
  }
  return image.url;
};

/**
 * Resolve all images in a scene's fill object
 * Converts imageIds to URLs
 * @param {object} fillImages - The fill.images object from scene JSON
 * @returns {object} Object with resolved URLs
 */
export const resolveSceneImages = (fillImages = {}) => {
  const resolved = {};
  Object.entries(fillImages).forEach(([key, value]) => {
    // If value is an imageId (no protocol), resolve it
    if (typeof value === 'string' && !value.startsWith('http')) {
      resolved[key] = getImageUrl(value);
    } else {
      // Already a URL, use as-is
      resolved[key] = value;
    }
  });
  return resolved;
};

export default IMAGE_LIBRARY;
