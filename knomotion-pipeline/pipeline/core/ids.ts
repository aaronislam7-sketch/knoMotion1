/** Id and slug helpers. Deterministic where possible for replayable artifacts. */

export const slugify = (input: string, fallback = 'item'): string => {
  const s = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return s || fallback;
};

/** Creates a job id like "job-20260609-ab12cd". Stable enough for grouping artifacts. */
export const makeJobId = (now: Date = new Date()): string => {
  const stamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8);
  return `job-${stamp.slice(0, 8)}-${rand}`;
};
