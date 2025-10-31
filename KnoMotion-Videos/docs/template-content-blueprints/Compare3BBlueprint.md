# Compare3B Template Blueprint v1.0
**Template:** Compare3B_DecisionTree  
**Pillar:** Compare  
**Version:** 5.0  
**Status:** Production Ready  
**Last Updated:** 2025-10-30

---

## Overview

The Compare3B Decision Tree template creates interactive decision flowcharts that guide users to the right option through yes/no questions. Visual, animated paths show the decision logic clearly.

**Use Cases:** Troubleshooting guides, product selection, architecture decisions, diagnostic flows, "which service?" guides

**Duration:** 25-40 seconds (scales with tree depth: 2-5 levels)

**Key Feature:** Animated decision paths with visual yes/no branches leading to outcomes.

---

## Template Identity

### Core Pattern
**Title → Root Question → Branch (Yes/No) → Sub-Questions → Outcome**

### Visual Signature
- Tree structure with nodes and connecting paths
- Animated path drawing (top-down)
- Color-coded branches (green=yes, red=no)
- Outcome badges with icons
- Question nodes pop in sequentially

### Emotional Tone
Guiding, logical, confidence-building

---

## Dynamic Configuration

### Minimal Example

```json
{
  "schema_version": "5.0",
  "template_id": "Compare3B_DecisionTree",
  "fill": {
    "decision": {
      "title": "Choose Your Compute Option",
      "tree": {
        "root": {
          "question": "Need full OS control?",
          "yes": "outcome_vm",
          "no": {
            "question": "Containerized app?",
            "yes": "outcome_cloudrun",
            "no": "outcome_appengine"
          }
        }
      },
      "outcomes": {
        "outcome_vm": {
          "label": "Compute Engine",
          "description": "Full VM control",
          "icon": "🖥️"
        },
        "outcome_cloudrun": {
          "label": "Cloud Run",
          "description": "Serverless containers",
          "icon": "📦"
        },
        "outcome_appengine": {
          "label": "App Engine",
          "description": "Fully managed platform",
          "icon": "🚀"
        }
      }
    }
  },
  "beats": {
    "title": 0.5,
    "rootQuestion": 1.5,
    "traverse": 3.0,
    "exit": 12.0
  }
}
```

---

## Tree Structure

### Node Types

**1. Question Node:**
```json
{
  "question": "Need Kubernetes?",
  "yes": <next_node_or_outcome>,
  "no": <next_node_or_outcome>
}
```

**2. Outcome Node (leaf):**
```json
"outcome_id"  // Reference to outcomes object
```

### Outcomes Definition

```json
{
  "outcomes": {
    "outcome_id": {
      "label": "Option Name",
      "description": "Brief description",
      "icon": "🎯"  // Emoji or icon
    }
  }
}
```

---

## Constraints

- **Tree Depth:** 2-5 levels (recommended: 3-4)
- **Questions:** ≤ 60 chars (must fit in node box)
- **Outcome Labels:** ≤ 30 chars
- **Outcome Descriptions:** ≤ 60 chars
- **Total Outcomes:** 2-8 (more = cluttered)

---

## Domain Examples

### Example 1: GCP Compute Selection

```json
{
  "template_id": "Compare3B_DecisionTree",
  "fill": {
    "decision": {
      "title": "Choose Your Compute Service",
      "tree": {
        "root": {
          "question": "Need full OS control?",
          "yes": "outcome_vm",
          "no": {
            "question": "Containerized app?",
            "yes": {
              "question": "Need Kubernetes?",
              "yes": "outcome_gke",
              "no": "outcome_cloudrun"
            },
            "no": "outcome_appengine"
          }
        }
      },
      "outcomes": {
        "outcome_vm": {
          "label": "Compute Engine",
          "description": "Full VM control, manage everything",
          "icon": "🖥️"
        },
        "outcome_gke": {
          "label": "Google Kubernetes Engine",
          "description": "Managed K8s for complex orchestration",
          "icon": "☸️"
        },
        "outcome_cloudrun": {
          "label": "Cloud Run",
          "description": "Serverless containers, auto-scaling",
          "icon": "📦"
        },
        "outcome_appengine": {
          "label": "App Engine",
          "description": "Fully managed platform, zero infra",
          "icon": "🚀"
        }
      }
    }
  }
}
```

### Example 2: Troubleshooting Flow

```json
{
  "decision": {
    "title": "Fix Connection Errors",
    "tree": {
      "root": {
        "question": "Can you ping the server?",
        "yes": {
          "question": "Is port 443 open?",
          "yes": "outcome_cert",
          "no": "outcome_firewall"
        },
        "no": {
          "question": "DNS resolves correctly?",
          "yes": "outcome_network",
          "no": "outcome_dns"
        }
      }
    },
    "outcomes": {
      "outcome_cert": {
        "label": "Certificate Issue",
        "description": "Check SSL/TLS certificates",
        "icon": "🔐"
      },
      "outcome_firewall": {
        "label": "Firewall Blocking",
        "description": "Open port 443 in firewall",
        "icon": "🚫"
      },
      "outcome_network": {
        "label": "Network Routing",
        "description": "Check VPC routing tables",
        "icon": "🌐"
      },
      "outcome_dns": {
        "label": "DNS Configuration",
        "description": "Fix DNS records or nameservers",
        "icon": "📡"
      }
    }
  }
}
```

---

## Animation Timing

**Auto-calculated based on tree depth:**
- Title: 0.5s
- Root question: 1.5s
- Each level: +1.5s per depth
- Outcome highlight: 1.2s
- Exit: auto

**Manual override:**
```json
{
  "beats": {
    "title": 0.5,
    "rootQuestion": 1.5,
    "traverse": 3.0,
    "outcome": 8.0,
    "exit": 11.0
  }
}
```

---

## Visual Design

### Colors
- **Questions:** Blue (accent)
- **Yes branch:** Green (accent2)
- **No branch:** Red (accent3)
- **Outcomes:** Purple (highlight)

### Animations
- Nodes pop in with spring physics
- Paths draw from parent to child
- Arrow heads appear at path end
- Outcome badges glow

---

## Best Practices

### Questions
- ✅ Binary yes/no format
- ✅ Clear, unambiguous
- ✅ Use decision-making language
- ❌ Avoid "maybe" or multi-choice

### Tree Structure
- ✅ Balance left/right branches
- ✅ Keep depth 3-4 levels max
- ✅ Group similar outcomes
- ❌ Don't create one-sided trees

---

## Technical Metadata

```javascript
export const TEMPLATE_ID = 'Compare3B_DecisionTree';
export const DURATION_MIN_FRAMES = 750;   // 25s @ 30fps
export const DURATION_MAX_FRAMES = 1200;  // 40s @ 30fps

export const CAPABILITIES = {
  supportsDynamicTreeDepth: true,
  hasAnimatedPaths: true,
};

export const AGNOSTIC_FEATURES = {
  treeDepth: { min: 2, max: 5, recommended: '3-4' },
  outcomeCount: { min: 2, max: 8 },
  crossDomainTested: ['tech-decisions', 'troubleshooting', 'product-selection']
};
```

---

**Version:** 1.0  
**Status:** Production Ready  
**Last Updated:** 2025-10-30
