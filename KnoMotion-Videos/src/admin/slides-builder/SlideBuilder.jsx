import React, { useMemo, useRef, useState } from 'react';
import { SlideRenderer } from '../../../../KnoSlides/src/core/SlideRenderer';
import { initializeBlocks } from '../../../../KnoSlides/src/blocks';
import '../../../../KnoSlides/src/index.css';

initializeBlocks();

const PHASES = ['explain', 'guided', 'construct', 'outcome'];
const ACTION_TYPES = ['click', 'select', 'toggle', 'drag', 'drop', 'input', 'reorder', 'inspect', 'compare', 'event'];

const STAGES = [
  { id: 'concept', label: '1. Concept' },
  { id: 'steps', label: '2. Steps' },
  { id: 'blocks', label: '3. Slots + Blocks + Tasks' },
  { id: 'review', label: '4. Review' },
];

const LAYOUT_SLOT_PRESETS = {
  columnSplit: ['OverviewSlot', 'TaskSlot', 'WorkspaceSlot', 'ReferenceSlot', 'OutputSlot'],
  rowStack: ['OverviewSlot', 'TaskSlot', 'WorkspaceSlot', 'ReferenceSlot', 'OutputSlot'],
  gridSlots: ['OverviewSlot', 'TaskSlot', 'WorkspaceSlot', 'ReferenceSlot', 'OutputSlot'],
  full: ['WorkspaceSlot', 'OutputSlot'],
};

const SLOT_ALLOWED_BLOCKS = {
  HeaderSlot: ['textBlock', 'contextCard', 'callout'],
  OverviewSlot: ['contextCard', 'textBlock', 'richText', 'textAndCodeBlock', 'media', 'callout', 'hintLadder'],
  TaskSlot: ['taskList', 'hintLadder', 'callout', 'textBlock'],
  WorkspaceSlot: ['dragAndDrop', 'flowDiagram', 'codeCompare', 'errorList', 'textAndCodeBlock', 'textBlock', 'selectGroup', 'toggleGroup', 'media', 'richText'],
  ReferenceSlot: ['referencePanel', 'tableView', 'textAndCodeBlock', 'textBlock', 'richText', 'media', 'callout'],
  OutputSlot: ['outputPreview', 'tableView', 'callout', 'textAndCodeBlock', 'textBlock'],
  FooterSlot: ['hintLadder', 'callout', 'textBlock', 'taskList'],
};

const BLOCK_HELP = {
  contextCard: 'Guided context panel with title, summary, and key points.',
  taskList: 'Checklist bound to step task IDs and progress.',
  hintLadder: 'Shows progressive hints from the step hint list.',
  callout: 'Emphasis panel for So What, insight, warning, or feedback.',
  textBlock: 'Simple text content with optional emphasis.',
  richText: 'Markdown-style rich text content.',
  textAndCodeBlock: 'Explanation paired with code snippet.',
  media: 'Image/diagram/lottie embed metadata.',
  referencePanel: 'Tabbed reference area with nested block content.',
  tableView: 'Dataset table with optional highlights.',
  outputPreview: 'Current vs expected output renderer.',
  dragAndDrop: 'Drag targets, validation rules, and feedback.',
  selectGroup: 'Single/multi-select interaction block.',
  toggleGroup: 'Set of toggles for guided checks.',
  flowDiagram: 'Node-edge process visualisation.',
  codeCompare: 'Before/after or side-by-side code comparison.',
  errorList: 'Clickable error findings with fixes.',
};

const ACTION_HELP = {
  event: 'Use for passive checks (learner explored or reviewed). Set an eventId only.',
  click: 'Learner must click a target. Set targetId and eventId.',
  drop: 'Learner must drop the correct item into a drop zone. Set targetId to zone ID and value to item ID.',
  drag: 'Learner must drag an item. Set targetId to draggable item ID.',
  select: 'Learner must pick an option. Set targetId and expected value.',
  toggle: 'Learner must set a toggle value. Set targetId and expected value.',
  input: 'Learner must input content. Set targetId and expected value.',
  reorder: 'Learner must reorder items. Use value for expected order key.',
  inspect: 'Learner must inspect content. Use eventId for emitted inspection event.',
  compare: 'Learner must compare before/after or diff. Use eventId or targetId.',
};

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const toTitle = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

const STAGE_HELP = {
  concept: [
    'Set concept identity and learning objective.',
    'Choose layout and enable the slots this slide will use.',
    'Set completion message and feature flags.',
  ],
  steps: [
    'Create how many steps this slide needs.',
    'Name each step and assign its phase.',
    'Do not configure content/tasks here.',
  ],
  blocks: [
    'For the selected step, write instruction first.',
    'Configure tasks and hints.',
    'Expand each slot and add blocks + block config.',
  ],
  review: [
    'Resolve validation issues.',
    'Copy final JSON output.',
  ],
};

const taskSummary = (task) => {
  const action = task?.action || {};
  const parts = [action.type || 'event'];
  if (action.targetId) parts.push(`target: ${action.targetId}`);
  if (action.value !== undefined && action.value !== '') parts.push(`value: ${String(action.value)}`);
  if (action.eventId) parts.push(`event: ${action.eventId}`);
  return parts.join(' | ');
};

const buildTrackableActionsFromBlock = (block) => {
  const cfg = block.config || {};
  const candidates = [];

  if (block.type === 'dragAndDrop') {
    (cfg.zones || []).forEach((zone) => {
      if (zone.id && zone.expectedItemId) {
        candidates.push({
          id: `cand-${block.id}-${zone.id}`,
          sourceBlockId: block.id,
          label: `Drop ${zone.expectedItemId} into ${zone.id}`,
          description: 'Drag-and-drop validation',
          task: {
            label: `Place ${zone.expectedItemId} in ${zone.label || zone.id}`,
            required: true,
            action: {
              type: 'drop',
              targetId: zone.id,
              eventId: 'drop',
              value: zone.expectedItemId,
            },
          },
        });
      }
    });
  }

  if (block.type === 'flowDiagram') {
    (cfg.nodes || []).forEach((node) => {
      if (node.id) {
        candidates.push({
          id: `cand-${block.id}-${node.id}`,
          sourceBlockId: block.id,
          label: `Click node ${node.id}`,
          description: 'Flow exploration',
          task: {
            label: `Inspect node: ${node.label || node.id}`,
            required: true,
            action: {
              type: 'click',
              targetId: node.id,
              eventId: 'node_clicked',
            },
          },
        });
      }
    });
  }

  if (block.type === 'selectGroup') {
    (cfg.options || []).forEach((option) => {
      if (option.id) {
        candidates.push({
          id: `cand-${block.id}-${option.id}`,
          sourceBlockId: block.id,
          label: `Select option ${option.id}`,
          description: 'Selection validation',
          task: {
            label: `Choose: ${option.label || option.id}`,
            required: Boolean(option.isCorrect),
            action: {
              type: 'select',
              targetId: block.id,
              eventId: 'option_selected',
              value: option.value ?? option.id,
            },
          },
        });
      }
    });
  }

  if (block.type === 'toggleGroup') {
    (cfg.toggles || []).forEach((toggle) => {
      if (toggle.id) {
        candidates.push({
          id: `cand-${block.id}-${toggle.id}`,
          sourceBlockId: block.id,
          label: `Set toggle ${toggle.id} to ${String(toggle.correctValue ?? true)}`,
          description: 'Toggle validation',
          task: {
            label: `Set toggle: ${toggle.label || toggle.id}`,
            required: true,
            action: {
              type: 'toggle',
              targetId: toggle.id,
              eventId: 'toggle_changed',
              value: toggle.correctValue ?? true,
            },
          },
        });
      }
    });
  }

  if (block.type === 'errorList') {
    (cfg.items || []).forEach((item) => {
      if (item.id) {
        candidates.push({
          id: `cand-${block.id}-${item.id}`,
          sourceBlockId: block.id,
          label: `Click error ${item.id}`,
          description: 'Error identification',
          task: {
            label: `Identify error: ${item.description || item.id}`,
            required: true,
            action: {
              type: 'click',
              targetId: item.id,
              eventId: 'error_clicked',
            },
          },
        });
      }
    });
  }

  if (block.type === 'codeCompare') {
    candidates.push({
      id: `cand-${block.id}-compare`,
      sourceBlockId: block.id,
      label: `Compare code in ${block.id}`,
      description: 'Comparison action',
      task: {
        label: `Review code comparison`,
        required: false,
        action: {
          type: 'compare',
          targetId: block.id,
          eventId: 'compare_reviewed',
        },
      },
    });
  }

  return candidates;
};

const buildTrackableActionsForStep = (step) => {
  const candidates = [];
  Object.values(step?.slots || {}).forEach((blocks = []) => {
    blocks.forEach((block) => {
      candidates.push(...buildTrackableActionsFromBlock(block));
    });
  });
  return candidates;
};

const createDefaultTask = (i = 1) => ({
  id: `task-${i}`,
  label: `Task ${i}`,
  required: true,
  action: {
    type: 'event',
    eventId: `task-${i}-event`,
  },
  hint: '',
  successMessage: '',
});

const createDefaultHint = (level = 1) => ({
  level,
  content: `Hint level ${level}`,
  targetId: '',
});

const createDefaultStep = (i = 1, layoutSlots = LAYOUT_SLOT_PRESETS.columnSplit) => {
  const slots = {};
  layoutSlots.forEach((slotName) => {
    slots[slotName] = [];
  });

  return {
    id: `step-${i}`,
    phase: PHASES[Math.min(i - 1, PHASES.length - 1)],
    title: `Step ${i}`,
    instruction: 'Describe what learner should do in this step.',
    tasks: [createDefaultTask(i)],
    hints: [createDefaultHint(1), createDefaultHint(2)],
    slots,
  };
};

const createDefaultSlide = () => {
  const step = createDefaultStep(1, LAYOUT_SLOT_PRESETS.columnSplit);
  step.slots.OverviewSlot = [
    {
      id: 'context-1',
      type: 'contextCard',
      config: {
        title: 'What am I seeing?',
        body: 'Add the step context here so learners know what to focus on.',
        keyPoints: ['Key point 1', 'Key point 2'],
      },
    },
  ];
  step.slots.TaskSlot = [
    {
      id: 'tasks-1',
      type: 'taskList',
      config: {
        taskIds: ['task-1'],
        showProgress: true,
        variant: 'checklist',
      },
    },
  ];

  return {
    id: 'new-slide',
    version: '1.0.0',
    concept: {
      id: 'concept-id',
      title: 'New Slide Concept',
      summary: 'Optional summary for authors.',
      learningObjective: 'Describe the understanding this slide builds.',
      enablesNext: 'Describe what this unlocks next.',
    },
    layout: {
      type: 'columnSplit',
      slots: [...LAYOUT_SLOT_PRESETS.columnSplit],
    },
    featureFlags: {
      showHints: true,
      showTaskSlot: true,
      showReferenceSlot: true,
      showOutputSlot: true,
    },
    steps: [step],
    completionMessage: 'Nice work. You completed this slide.',
  };
};

const blockDefaultConfig = (type, step) => {
  switch (type) {
    case 'contextCard':
      return { title: 'Context Title', body: 'Explain what this section means.', keyPoints: ['Point 1', 'Point 2'] };
    case 'taskList':
      return { taskIds: step.tasks.map((t) => t.id), showProgress: true, variant: 'checklist' };
    case 'hintLadder':
      return { askKnoLabel: 'Ask KNO', showLevelIndicator: true };
    case 'callout':
      return { tone: 'info', title: 'So What?', body: 'Add practical meaning here.' };
    case 'textBlock':
      return { text: 'Add text content.', emphasis: 'normal', align: 'left' };
    case 'richText':
      return { markdown: '## Heading\n\nAdd rich markdown content here.' };
    case 'textAndCodeBlock':
      return { text: 'Explain the snippet.', code: 'SELECT *\nFROM table_name;', language: 'sql', codePosition: 'below' };
    case 'media':
      return { type: 'image', src: 'https://example.com/image.png', alt: 'Describe media', caption: 'Optional caption' };
    case 'referencePanel':
      return {
        title: 'Reference',
        content: {
          id: 'ref-text-1',
          type: 'textBlock',
          config: { text: 'Reference details live here.' },
        },
      };
    case 'tableView':
      return {
        title: 'Table',
        columns: [
          { key: 'col1', label: 'col1', type: 'string' },
          { key: 'col2', label: 'col2', type: 'string' },
        ],
        rows: [
          { col1: 'A', col2: 'B' },
          { col1: 'C', col2: 'D' },
        ],
      };
    case 'outputPreview':
      return { type: 'text', title: 'Output', current: 'Current output', expected: 'Expected output', showExpected: true };
    case 'dragAndDrop':
      return {
        items: [{ id: 'item-1', content: 'Item A', validTargets: ['zone-1'] }],
        zones: [{ id: 'zone-1', label: 'Target', expectedItemId: 'item-1' }],
        layout: 'inline',
        validation: 'immediate',
      };
    case 'selectGroup':
      return {
        options: [
          { id: 'opt-1', label: 'Option 1', value: 'opt1', isCorrect: true },
          { id: 'opt-2', label: 'Option 2', value: 'opt2' },
        ],
        selectionMode: 'single',
        validation: 'onSubmit',
      };
    case 'toggleGroup':
      return {
        toggles: [
          { id: 'toggle-1', label: 'Toggle 1', defaultValue: false, correctValue: true },
          { id: 'toggle-2', label: 'Toggle 2', defaultValue: false, correctValue: false },
        ],
        layout: 'vertical',
        validation: 'onSubmit',
      };
    case 'flowDiagram':
      return {
        nodes: [
          { id: 'start', type: 'start', label: 'Start', position: { x: 50, y: 50 } },
          { id: 'end', type: 'end', label: 'End', position: { x: 250, y: 50 } },
        ],
        edges: [{ id: 'edge-1', source: 'start', target: 'end', label: 'next' }],
        interactive: true,
      };
    case 'codeCompare':
      return {
        leftCode: 'print("before")',
        rightCode: 'print("after")',
        language: 'python',
        leftLabel: 'Before',
        rightLabel: 'After',
        diffMode: 'side-by-side',
        showDiff: true,
      };
    case 'errorList':
      return {
        items: [
          {
            id: 'error-1',
            lineStart: 1,
            description: 'Example issue',
            explanation: 'Explain the issue here.',
            severity: 'error',
            category: 'logic',
            correctFix: 'Describe the fix.',
          },
        ],
        showSeverity: true,
        showCategory: true,
        selectable: true,
      };
    default:
      return {};
  }
};

const emptyFromValue = (sample) => {
  if (Array.isArray(sample)) {
    if (!sample.length) return '';
    return emptyFromValue(sample[0]);
  }
  if (sample && typeof sample === 'object') {
    return Object.fromEntries(Object.keys(sample).map((k) => [k, emptyFromValue(sample[k])]));
  }
  if (typeof sample === 'number') return 0;
  if (typeof sample === 'boolean') return false;
  return '';
};

const PrimitiveInput = ({ label, value, onChange, multiline = false }) => {
  const baseCls = 'mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm';
  const isBoolean = typeof value === 'boolean';
  const isNumber = typeof value === 'number';

  return (
    <label className="text-xs text-gray-300 block">
      {label}
      {isBoolean ? (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="ml-2 align-middle"
        />
      ) : multiline ? (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseCls} h-20`}
        />
      ) : (
        <input
          type={isNumber ? 'number' : 'text'}
          value={value ?? ''}
          onChange={(e) => onChange(isNumber ? Number(e.target.value) : e.target.value)}
          className={baseCls}
        />
      )}
    </label>
  );
};

const StructuredEditor = ({ label, value, onChange, depth = 0 }) => {
  const isArray = Array.isArray(value);
  const isObject = value && typeof value === 'object' && !isArray;

  if (!isArray && !isObject) {
    const multiline = typeof value === 'string' && (value.includes('\n') || value.length > 80);
    return <PrimitiveInput label={label} value={value} onChange={onChange} multiline={multiline} />;
  }

  if (isArray) {
    const sample = value[0];
    return (
      <div className="rounded-lg border border-gray-800 p-3 bg-gray-950/50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-gray-300">{label} (array)</div>
          <button
            onClick={() => onChange([...(value || []), emptyFromValue(sample)])}
            className="text-[11px] px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500"
          >
            + Item
          </button>
        </div>

        {!value.length && <div className="text-[11px] text-gray-500">No items yet.</div>}

        {value.map((item, index) => (
          <div key={`${label}-${index}`} className="rounded border border-gray-800 p-2 bg-gray-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-gray-400">Item {index + 1}</div>
              <button
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300"
              >
                Remove
              </button>
            </div>
            <StructuredEditor
              label={`item_${index + 1}`}
              value={item}
              onChange={(nextItem) => {
                const next = [...value];
                next[index] = nextItem;
                onChange(next);
              }}
              depth={depth + 1}
            />
          </div>
        ))}
      </div>
    );
  }

  const entries = Object.entries(value);
  return (
    <div className="rounded-lg border border-gray-800 p-3 bg-gray-950/50 space-y-3">
      <div className="text-xs font-medium text-gray-300">{label} (object)</div>
      <div className="grid grid-cols-1 gap-2">
        {entries.map(([key, val]) => (
          <StructuredEditor
            key={key}
            label={toTitle(key)}
            value={val}
            onChange={(nextVal) => onChange({ ...value, [key]: nextVal })}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  );
};

const collectTargetIds = (step) => {
  const ids = new Set();

  Object.values(step.slots || {}).forEach((blocks = []) => {
    blocks.forEach((block) => {
      if (block.id) ids.add(block.id);
      const cfg = block.config || {};

      if (block.type === 'dragAndDrop') {
        (cfg.items || []).forEach((item) => item.id && ids.add(item.id));
        (cfg.zones || []).forEach((zone) => zone.id && ids.add(zone.id));
      }

      if (block.type === 'flowDiagram') {
        (cfg.nodes || []).forEach((node) => node.id && ids.add(node.id));
        (cfg.edges || []).forEach((edge) => edge.id && ids.add(edge.id));
      }

      if (block.type === 'errorList') {
        (cfg.items || []).forEach((item) => item.id && ids.add(item.id));
      }
    });
  });

  return Array.from(ids);
};

const ActionEditor = ({ action, onChange, targetOptions }) => {
  const nextAction = action || { type: 'event' };

  return (
    <div className="rounded-lg border border-gray-700 p-3 bg-gray-900/60 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-xs text-gray-300">
          Action Type
          <select
            value={nextAction.type || 'event'}
            onChange={(e) => onChange({ type: e.target.value })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          >
            {ACTION_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>

        <label className="text-xs text-gray-300">
          Event ID
          <input
            value={nextAction.eventId || ''}
            onChange={(e) => onChange({ ...nextAction, eventId: e.target.value })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
            placeholder="e.g. drop"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-xs text-gray-300">
          Target ID
          <select
            value={nextAction.targetId || ''}
            onChange={(e) => onChange({ ...nextAction, targetId: e.target.value || undefined })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          >
            <option value="">(none)</option>
            {targetOptions.map((id) => <option key={id} value={id}>{id}</option>)}
          </select>
        </label>

        <label className="text-xs text-gray-300">
          Expected Value
          <input
            value={nextAction.value ?? ''}
            onChange={(e) => onChange({ ...nextAction, value: e.target.value || undefined })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
            placeholder="e.g. item-1"
          />
        </label>
      </div>

      <div className="text-xs text-indigo-200 bg-indigo-900/30 border border-indigo-500/30 rounded p-2">
        {ACTION_HELP[nextAction.type]}
      </div>

      {nextAction.type === 'drop' && (
        <div className="text-[11px] text-amber-200 bg-amber-900/30 border border-amber-500/30 rounded p-2">
          Drag-and-drop task wiring: set `targetId` to a drop zone ID and set `value` to the expected dragged item ID.
          Example: `targetId: drop-condition`, `value: join-condition`.
        </div>
      )}

      <div className="rounded border border-gray-700 p-2 bg-gray-950/60">
        <div className="text-[11px] font-medium text-gray-300 mb-2">Validation (optional)</div>
        <label className="text-xs text-gray-300 block">
          Validation Type
          <select
            value={nextAction.validation?.type || ''}
            onChange={(e) => {
              const type = e.target.value;
              if (!type) {
                const { validation, ...rest } = nextAction;
                onChange(rest);
                return;
              }
              onChange({
                ...nextAction,
                validation: {
                  type,
                  expected: nextAction.validation?.expected || '',
                  customValidator: nextAction.validation?.customValidator || '',
                },
              });
            }}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          >
            <option value="">(none)</option>
            <option value="equals">equals</option>
            <option value="includes">includes</option>
            <option value="matches">matches</option>
            <option value="custom">custom</option>
          </select>
        </label>

        {nextAction.validation && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <label className="text-xs text-gray-300">
              Expected
              <input
                value={nextAction.validation.expected ?? ''}
                onChange={(e) => onChange({
                  ...nextAction,
                  validation: {
                    ...nextAction.validation,
                    expected: e.target.value,
                  },
                })}
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
              />
            </label>

            <label className="text-xs text-gray-300">
              Custom Validator (if custom)
              <input
                value={nextAction.validation.customValidator || ''}
                onChange={(e) => onChange({
                  ...nextAction,
                  validation: {
                    ...nextAction.validation,
                    customValidator: e.target.value,
                  },
                })}
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, index, onChange, onDelete, targetOptions, advancedMode }) => {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900/70 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-100">Task {index + 1}</div>
        <button onClick={onDelete} className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30">Remove</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-xs text-gray-300">
          Task ID
          <input
            value={task.id}
            onChange={(e) => onChange({ ...task, id: e.target.value })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          />
        </label>

        <label className="text-xs text-gray-300">
          Label
          <input
            value={task.label}
            onChange={(e) => onChange({ ...task, label: e.target.value })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-xs text-gray-300">
          Task Hint
          <input
            value={task.hint || ''}
            onChange={(e) => onChange({ ...task, hint: e.target.value })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          />
        </label>

        <label className="text-xs text-gray-300">
          Success Message
          <input
            value={task.successMessage || ''}
            onChange={(e) => onChange({ ...task, successMessage: e.target.value })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <label className="text-xs text-gray-300 flex items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(task.required)}
          onChange={(e) => onChange({ ...task, required: e.target.checked })}
        />
        Required to continue
      </label>

      {advancedMode ? (
        <ActionEditor
          action={task.action}
          onChange={(nextAction) => onChange({ ...task, action: nextAction })}
          targetOptions={targetOptions}
        />
      ) : (
        <div className="text-xs text-indigo-100 bg-indigo-900/25 border border-indigo-500/30 rounded p-2">
          Action: {taskSummary(task)}
        </div>
      )}
    </div>
  );
};

const HintCard = ({ hint, index, onChange, onDelete, targetOptions }) => {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900/70 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-100">Hint {index + 1}</div>
        <button onClick={onDelete} className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30">Remove</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-xs text-gray-300">
          Level
          <input
            type="number"
            value={hint.level}
            onChange={(e) => onChange({ ...hint, level: Number(e.target.value) })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          />
        </label>

        <label className="text-xs text-gray-300">
          Target ID (optional)
          <select
            value={hint.targetId || ''}
            onChange={(e) => onChange({ ...hint, targetId: e.target.value })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          >
            <option value="">(none)</option>
            {targetOptions.map((id) => <option key={id} value={id}>{id}</option>)}
          </select>
        </label>
      </div>

      <label className="text-xs text-gray-300 block">
        Hint Content
        <textarea
          value={hint.content}
          onChange={(e) => onChange({ ...hint, content: e.target.value })}
          className="mt-1 w-full h-20 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
        />
      </label>
    </div>
  );
};

const BlockCard = ({ block, slotName, step, allowedTypes, onUpdate, onDelete, onCreateTasksFromBlock }) => {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-3 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-400">{slotName}</div>
          <div className="text-sm font-semibold text-white">{block.type}</div>
          <div className="text-xs text-gray-500 mt-0.5">{BLOCK_HELP[block.type]}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCreateTasksFromBlock(block)}
            className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
          >
            Create Suggested Tasks
          </button>
          <button onClick={onDelete} className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30">
            Remove
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-xs text-gray-300">
          Block ID
          <input
            value={block.id}
            onChange={(e) => onUpdate({ ...block, id: e.target.value })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          />
        </label>

        <label className="text-xs text-gray-300">
          Block Type
          <select
            value={block.type}
            onChange={(e) => onUpdate({ ...block, type: e.target.value, config: blockDefaultConfig(e.target.value, step) })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          >
            {allowedTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-gray-300">
          Style Preset (optional)
          <input
            value={block.stylePreset || ''}
            onChange={(e) => onUpdate({ ...block, stylePreset: e.target.value || undefined })}
            className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
            placeholder="e.g. highlighted"
          />
        </label>
      </div>

      <StructuredEditor
        label="Block Config"
        value={block.config}
        onChange={(nextConfig) => onUpdate({ ...block, config: nextConfig })}
      />
    </div>
  );
};

export const SlideBuilder = () => {
  const idCounter = useRef(2);
  const [stage, setStage] = useState('concept');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [expandedSlots, setExpandedSlots] = useState(new Set());
  const [slide, setSlide] = useState(createDefaultSlide());
  const [copied, setCopied] = useState(false);
  const [advancedTaskMode, setAdvancedTaskMode] = useState(false);

  const activeStep = slide.steps[activeStepIndex];
  const targetOptions = useMemo(() => (activeStep ? collectTargetIds(activeStep) : []), [activeStep]);
  const trackableActions = useMemo(() => (activeStep ? buildTrackableActionsForStep(activeStep) : []), [activeStep]);

  const updateSlide = (fn) => {
    setSlide((prev) => {
      const next = clone(prev);
      fn(next);
      return next;
    });
  };

  const syncSlotsWithLayout = (nextLayoutSlots) => {
    updateSlide((draft) => {
      draft.layout.slots = nextLayoutSlots;
      draft.steps.forEach((step) => {
        nextLayoutSlots.forEach((slotName) => {
          if (!step.slots[slotName]) step.slots[slotName] = [];
        });
        Object.keys(step.slots).forEach((slotName) => {
          if (!nextLayoutSlots.includes(slotName)) {
            delete step.slots[slotName];
          }
        });
      });
    });
  };

  const addStep = () => {
    updateSlide((draft) => {
      const idx = draft.steps.length + 1;
      draft.steps.push(createDefaultStep(idx, draft.layout.slots));
    });
    setActiveStepIndex(slide.steps.length);
    setExpandedSlots(new Set());
  };

  const removeStep = (index) => {
    if (slide.steps.length <= 1) return;
    updateSlide((draft) => {
      draft.steps.splice(index, 1);
    });
    setActiveStepIndex((prev) => Math.max(0, Math.min(prev, slide.steps.length - 2)));
    setExpandedSlots(new Set());
  };

  const toggleSlotAccordion = (slotName) => {
    const key = `${activeStepIndex}:${slotName}`;
    setExpandedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const addBlockToSlot = (slotName) => {
    const allowed = SLOT_ALLOWED_BLOCKS[slotName] || Object.keys(BLOCK_HELP);
    const type = allowed[0];
    const blockId = `${type}-${idCounter.current++}`;
    const newBlock = {
      id: blockId,
      type,
      config: blockDefaultConfig(type, activeStep),
    };

    updateSlide((draft) => {
      const step = draft.steps[activeStepIndex];
      if (!step.slots[slotName]) step.slots[slotName] = [];
      step.slots[slotName].push(newBlock);
    });
  };

  const createTaskFromCandidate = (candidate) => {
    updateSlide((draft) => {
      const step = draft.steps[activeStepIndex];
      const index = step.tasks.length + 1;
      step.tasks.push({
        id: `task-${index}`,
        label: candidate.task.label,
        required: candidate.task.required,
        action: candidate.task.action,
        hint: '',
        successMessage: '',
      });
    });
  };

  const createTasksFromBlock = (block) => {
    const candidates = buildTrackableActionsFromBlock(block);
    if (!candidates.length) return;

    updateSlide((draft) => {
      const step = draft.steps[activeStepIndex];
      candidates.forEach((candidate) => {
        const index = step.tasks.length + 1;
        step.tasks.push({
          id: `task-${index}`,
          label: candidate.task.label,
          required: candidate.task.required,
          action: candidate.task.action,
          hint: '',
          successMessage: '',
        });
      });
    });
  };

  const validation = useMemo(() => {
    const errors = [];

    if (!slide.concept.title.trim()) errors.push('Concept title is required.');
    if (!slide.concept.learningObjective.trim()) errors.push('Learning objective is required.');
    if (!slide.steps.length) errors.push('At least one step is required.');

    slide.steps.forEach((step, idx) => {
      if (!step.id.trim()) errors.push(`Step ${idx + 1}: id is required.`);
      if (!step.title.trim()) errors.push(`Step ${idx + 1}: title is required.`);
      if (!step.hints || step.hints.length < 2) errors.push(`Step ${idx + 1}: add at least 2 hints.`);
      if (!step.tasks || step.tasks.length < 1) errors.push(`Step ${idx + 1}: add at least 1 task.`);
    });

    return errors;
  }, [slide]);

  const checklist = useMemo(() => {
    const conceptDone = Boolean(
      slide.concept.id.trim() &&
      slide.concept.title.trim() &&
      slide.concept.learningObjective.trim() &&
      slide.concept.enablesNext.trim()
    );

    const stepsDone = slide.steps.length > 0 && slide.steps.every((step) => (
      step.id.trim() &&
      step.title.trim() &&
      Boolean(step.phase)
    ));

    const taskHintDone = slide.steps.length > 0 && slide.steps.every((step) => (
      step.instruction.trim() &&
      step.tasks.length > 0 &&
      step.hints.length > 0
    ));

    const slotsDone = slide.steps.length > 0 && slide.steps.every((step) => (
      slide.layout.slots.every((slotName) => (step.slots?.[slotName] || []).length > 0)
    ));

    return [
      { key: 'concept', label: 'Concept metadata complete', done: conceptDone },
      { key: 'steps', label: 'Steps defined and named', done: stepsDone },
      { key: 'taskHint', label: 'Per-step instruction + tasks + hints', done: taskHintDone },
      { key: 'slots', label: 'Each active slot has blocks for every step', done: slotsDone },
    ];
  }, [slide]);

  const jsonOutput = useMemo(() => JSON.stringify(slide, null, 2), [slide]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/90 backdrop-blur sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-indigo-300">KnoSlides Builder</h1>
            <p className="text-sm text-gray-400">Structured schema authoring with slot-aware blocks + live preview.</p>
          </div>
          <div className="flex items-center gap-2">
            {STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStage(s.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  stage === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-indigo-200">Builder Checklist</h2>
              <span className="text-xs text-gray-500">
                {checklist.filter((item) => item.done).length}/{checklist.length} complete
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {checklist.map((item) => (
                <div
                  key={item.key}
                  className={`text-xs rounded border px-2.5 py-2 ${
                    item.done
                      ? 'border-emerald-500/30 bg-emerald-900/20 text-emerald-200'
                      : 'border-amber-500/30 bg-amber-900/20 text-amber-200'
                  }`}
                >
                  {item.done ? '✓' : '•'} {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <h2 className="text-sm font-semibold text-indigo-200 mb-2">Current Stage Focus</h2>
            <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
              {STAGE_HELP[stage].map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          {stage === 'concept' && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 space-y-5">
              <h2 className="text-lg font-semibold text-indigo-200">Slide Metadata + Layout</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm text-gray-300">
                  Slide ID
                  <input
                    value={slide.id || ''}
                    onChange={(e) => updateSlide((d) => { d.id = e.target.value; })}
                    className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    placeholder="e.g. build-and-verify-inner-join"
                  />
                </label>

                <label className="text-sm text-gray-300">
                  Version
                  <input
                    value={slide.version || ''}
                    onChange={(e) => updateSlide((d) => { d.version = e.target.value; })}
                    className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    placeholder="e.g. 1.0.0"
                  />
                </label>

                <label className="text-sm text-gray-300">
                  Concept ID
                  <input
                    value={slide.concept.id}
                    onChange={(e) => updateSlide((d) => { d.concept.id = e.target.value; })}
                    className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    placeholder="e.g. sql-inner-join"
                  />
                </label>

                <label className="text-sm text-gray-300">
                  Layout Type
                  <select
                    value={slide.layout.type}
                    onChange={(e) => {
                      const nextType = e.target.value;
                      updateSlide((d) => { d.layout.type = nextType; });
                      syncSlotsWithLayout([...LAYOUT_SLOT_PRESETS[nextType]]);
                    }}
                    className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  >
                    {Object.keys(LAYOUT_SLOT_PRESETS).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="text-sm text-gray-300 block">
                Concept Title (required)
                <input
                  value={slide.concept.title}
                  onChange={(e) => updateSlide((d) => { d.concept.title = e.target.value; })}
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                />
              </label>

              <label className="text-sm text-gray-300 block">
                Summary
                <textarea
                  value={slide.concept.summary || ''}
                  onChange={(e) => updateSlide((d) => { d.concept.summary = e.target.value; })}
                  className="mt-1 w-full h-20 bg-gray-800 border border-gray-700 rounded px-3 py-2"
                />
              </label>

              <label className="text-sm text-gray-300 block">
                Learning Objective (required)
                <textarea
                  value={slide.concept.learningObjective}
                  onChange={(e) => updateSlide((d) => { d.concept.learningObjective = e.target.value; })}
                  className="mt-1 w-full h-20 bg-gray-800 border border-gray-700 rounded px-3 py-2"
                />
              </label>

              <label className="text-sm text-gray-300 block">
                Enables Next (required)
                <textarea
                  value={slide.concept.enablesNext}
                  onChange={(e) => updateSlide((d) => { d.concept.enablesNext = e.target.value; })}
                  className="mt-1 w-full h-20 bg-gray-800 border border-gray-700 rounded px-3 py-2"
                />
              </label>

              <label className="text-sm text-gray-300 block">
                Completion Message
                <textarea
                  value={slide.completionMessage || ''}
                  onChange={(e) => updateSlide((d) => { d.completionMessage = e.target.value; })}
                  className="mt-1 w-full h-24 bg-gray-800 border border-gray-700 rounded px-3 py-2"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs text-gray-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(slide.featureFlags?.showHints)}
                    onChange={(e) => updateSlide((d) => { d.featureFlags.showHints = e.target.checked; })}
                  />
                  Show Hints
                </label>
                <label className="text-xs text-gray-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(slide.featureFlags?.showTaskSlot)}
                    onChange={(e) => updateSlide((d) => { d.featureFlags.showTaskSlot = e.target.checked; })}
                  />
                  Show Task Slot
                </label>
                <label className="text-xs text-gray-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(slide.featureFlags?.showReferenceSlot)}
                    onChange={(e) => updateSlide((d) => { d.featureFlags.showReferenceSlot = e.target.checked; })}
                  />
                  Show Reference Slot
                </label>
                <label className="text-xs text-gray-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(slide.featureFlags?.showOutputSlot)}
                    onChange={(e) => updateSlide((d) => { d.featureFlags.showOutputSlot = e.target.checked; })}
                  />
                  Show Output Slot
                </label>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-200 mb-2">Active Slots in Layout</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.keys(SLOT_ALLOWED_BLOCKS).map((slotName) => {
                    const checked = slide.layout.slots.includes(slotName);
                    return (
                      <label key={slotName} className="text-xs text-gray-300 flex items-center gap-2 p-2 rounded border border-gray-700 bg-gray-800/60">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...slide.layout.slots, slotName]
                              : slide.layout.slots.filter((s) => s !== slotName);
                            syncSlotsWithLayout(next);
                          }}
                        />
                        {slotName}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {stage === 'steps' && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-indigo-200">Step Structure + Naming</h2>
                <button onClick={addStep} className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-sm font-medium">+ Add Step</button>
              </div>

              <p className="text-xs text-gray-400">
                This stage is only for defining how many steps exist and naming them.
                Configure slots, content blocks, tasks, hints, and instruction in stage 3.
              </p>

              <div className="flex flex-wrap gap-2">
                {slide.steps.map((step, idx) => (
                  <button
                    key={step.id || idx}
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setExpandedSlots(new Set());
                    }}
                    className={`px-3 py-1.5 rounded text-sm ${idx === activeStepIndex ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    {idx + 1}. {step.phase}
                  </button>
                ))}
              </div>

              {activeStep && (
                <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Editing: Step {activeStepIndex + 1}</h3>
                    <button
                      onClick={() => removeStep(activeStepIndex)}
                      disabled={slide.steps.length <= 1}
                      className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-300 disabled:opacity-40"
                    >
                      Remove Step
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="text-sm text-gray-300">Step ID (required)
                      <input
                        value={activeStep.id}
                        onChange={(e) => updateSlide((d) => { d.steps[activeStepIndex].id = e.target.value; })}
                        className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5"
                        placeholder="e.g. step-1-explain"
                      />
                    </label>
                    <label className="text-sm text-gray-300">Phase
                      <select
                        value={activeStep.phase}
                        onChange={(e) => updateSlide((d) => { d.steps[activeStepIndex].phase = e.target.value; })}
                        className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5"
                      >
                        {PHASES.map((phase) => <option key={phase} value={phase}>{phase}</option>)}
                      </select>
                    </label>
                    <label className="text-sm text-gray-300">Step Title (required)
                      <input
                        value={activeStep.title}
                        onChange={(e) => updateSlide((d) => { d.steps[activeStepIndex].title = e.target.value; })}
                        className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5"
                        placeholder="e.g. Understand Source Tables"
                      />
                    </label>
                  </div>

                </div>
              )}
            </div>
          )}

          {stage === 'blocks' && activeStep && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-indigo-200">Slots + Blocks + Tasks</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Editing step:</span>
                  <select
                    value={activeStepIndex}
                    onChange={(e) => {
                      setActiveStepIndex(Number(e.target.value));
                      setExpandedSlots(new Set());
                    }}
                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
                  >
                    {slide.steps.map((step, idx) => (
                      <option key={`${step.id}-${idx}`} value={idx}>{idx + 1}. {step.title || step.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="text-sm text-gray-300 block">Step Instruction
                <textarea
                  value={activeStep.instruction}
                  onChange={(e) => updateSlide((d) => { d.steps[activeStepIndex].instruction = e.target.value; })}
                  className="mt-1 w-full h-20 bg-gray-800 border border-gray-700 rounded px-2 py-1.5"
                  placeholder="Tell the learner exactly what to do in this step."
                />
              </label>

              <div className="rounded-lg border border-indigo-500/30 bg-indigo-900/20 p-3 text-xs text-indigo-100">
                Task wiring for drag/drop: use action type `drop`, set `targetId` to the drop zone id, set `value` to the expected draggable item id,
                and set eventId to the event emitted by the block (commonly `drop`).
              </div>

              <div className="rounded-lg border border-cyan-500/30 bg-cyan-900/20 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-cyan-100">Trackable Actions (Generated from this step)</h4>
                  <span className="text-xs text-cyan-200">{trackableActions.length} found</span>
                </div>
                <p className="text-xs text-cyan-50/90">
                  Choose from generated actions below to auto-create task payloads (`type`, `targetId`, `value`, `eventId`).
                </p>
                {trackableActions.length === 0 ? (
                  <div className="text-xs text-cyan-100/90 border border-dashed border-cyan-400/40 rounded p-2">
                    No trackable actions yet. Add interactive blocks (dragAndDrop, flowDiagram, selectGroup, toggleGroup, errorList, codeCompare) to generate options.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {trackableActions.map((candidate) => (
                      <div key={candidate.id} className="rounded border border-cyan-500/25 bg-cyan-950/20 p-2.5">
                        <div className="text-xs font-semibold text-cyan-100">{candidate.label}</div>
                        <div className="text-[11px] text-cyan-200 mt-1">{candidate.description}</div>
                        <button
                          onClick={() => createTaskFromCandidate(candidate)}
                          className="mt-2 text-[11px] px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white"
                        >
                          Add as Task
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-lg border border-gray-800 p-3 bg-gray-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-200">Tasks</h4>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-300 flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={advancedTaskMode}
                          onChange={(e) => setAdvancedTaskMode(e.target.checked)}
                        />
                        Advanced mode
                      </label>
                      <button
                        onClick={() => updateSlide((d) => { d.steps[activeStepIndex].tasks.push(createDefaultTask(d.steps[activeStepIndex].tasks.length + 1)); })}
                        className="text-xs px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500"
                      >
                        + Task
                      </button>
                    </div>
                  </div>

                  {activeStep.tasks.map((task, taskIndex) => (
                    <TaskCard
                      key={task.id || `task-${taskIndex}`}
                      task={task}
                      index={taskIndex}
                      targetOptions={targetOptions}
                      advancedMode={advancedTaskMode}
                      onChange={(nextTask) => updateSlide((d) => { d.steps[activeStepIndex].tasks[taskIndex] = nextTask; })}
                      onDelete={() => updateSlide((d) => { d.steps[activeStepIndex].tasks.splice(taskIndex, 1); })}
                    />
                  ))}
                </div>

                <div className="rounded-lg border border-gray-800 p-3 bg-gray-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-200">Hints</h4>
                    <button
                      onClick={() => updateSlide((d) => { d.steps[activeStepIndex].hints.push(createDefaultHint(d.steps[activeStepIndex].hints.length + 1)); })}
                      className="text-xs px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500"
                    >
                      + Hint
                    </button>
                  </div>

                  {activeStep.hints.map((hint, hintIndex) => (
                    <HintCard
                      key={`${hint.level}-${hintIndex}`}
                      hint={hint}
                      index={hintIndex}
                      targetOptions={targetOptions}
                      onChange={(nextHint) => updateSlide((d) => { d.steps[activeStepIndex].hints[hintIndex] = nextHint; })}
                      onDelete={() => updateSlide((d) => { d.steps[activeStepIndex].hints.splice(hintIndex, 1); })}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {slide.layout.slots.map((slotName) => {
                  const allowedTypes = SLOT_ALLOWED_BLOCKS[slotName] || Object.keys(BLOCK_HELP);
                  const blocks = activeStep.slots[slotName] || [];
                  const slotKey = `${activeStepIndex}:${slotName}`;
                  const isExpanded = expandedSlots.has(slotKey);

                  return (
                    <div key={slotName} className="rounded-xl border border-gray-800 bg-gray-950/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-white">{slotName}</h3>
                          <p className="text-xs text-gray-500">Allowed blocks: {allowedTypes.join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSlotAccordion(slotName)}
                            className="px-2.5 py-1.5 rounded text-xs bg-gray-700 hover:bg-gray-600"
                          >
                            {isExpanded ? 'Collapse' : 'Expand'}
                          </button>
                          {isExpanded && (
                            <button
                              onClick={() => addBlockToSlot(slotName)}
                              className="px-2.5 py-1.5 rounded text-xs bg-indigo-600 hover:bg-indigo-500"
                            >
                              + Add Block
                            </button>
                          )}
                        </div>
                      </div>

                      {!isExpanded && (
                        <div className="text-xs text-gray-500 border border-dashed border-gray-700 rounded p-3">
                          Collapsed. {blocks.length} block{blocks.length !== 1 ? 's' : ''} configured.
                        </div>
                      )}

                      {isExpanded && (
                        <>
                          {blocks.length === 0 ? (
                            <div className="text-xs text-gray-500 border border-dashed border-gray-700 rounded p-3">No blocks yet for this slot.</div>
                          ) : (
                            <div className="space-y-3">
                              {blocks.map((block, blockIndex) => (
                                <BlockCard
                                  key={block.id || `${slotName}-${blockIndex}`}
                                  block={block}
                                  slotName={slotName}
                                  step={activeStep}
                                  allowedTypes={allowedTypes}
                                  onCreateTasksFromBlock={createTasksFromBlock}
                                  onUpdate={(nextBlock) => updateSlide((d) => { d.steps[activeStepIndex].slots[slotName][blockIndex] = nextBlock; })}
                                  onDelete={() => updateSlide((d) => { d.steps[activeStepIndex].slots[slotName].splice(blockIndex, 1); })}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stage === 'review' && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 space-y-4">
              <h2 className="text-lg font-semibold text-indigo-200">Review + JSON Output</h2>

              {validation.length > 0 ? (
                <div className="rounded-lg border border-red-500/40 bg-red-900/20 p-3">
                  <div className="text-sm font-semibold text-red-300 mb-1">Fix before using JSON:</div>
                  <ul className="text-xs text-red-200 space-y-1 list-disc list-inside">
                    {validation.map((msg, idx) => <li key={`${msg}-${idx}`}>{msg}</li>)}
                  </ul>
                </div>
              ) : (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-900/20 p-3 text-sm text-emerald-300">
                  Slide JSON passes base checks.
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Manual save workflow: copy JSON, then paste into your desired file.</div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-sm"
                >
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
              </div>

              <pre className="bg-gray-950 border border-gray-800 rounded-xl p-4 max-h-[70vh] overflow-auto text-xs text-gray-200">
                <code>{jsonOutput}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="xl:col-span-5">
          <div className="sticky top-[88px] space-y-4">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-200">Live Slide Preview</h3>
                <span className="text-xs text-gray-500">Uses current draft JSON</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-800 bg-white max-h-[78vh] overflow-y-auto">
                <SlideRenderer
                  slide={slide}
                  onStepChange={(index) => setActiveStepIndex(index)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
              <div className="text-sm font-semibold text-gray-200 mb-2">Block Support Coverage</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                {Object.keys(BLOCK_HELP).map((type) => (
                  <div key={type} className="rounded border border-gray-800 px-2 py-1 bg-gray-950/50">{type}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideBuilder;
