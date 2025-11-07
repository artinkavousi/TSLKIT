import schema from './codexTask.schema.json' with { type: 'json' };

type ImmutableArray<T> = readonly T[];

export type SourceArtifactType =
  | 'noise'
  | 'material'
  | 'post'
  | 'compute'
  | 'utility'
  | 'docs'
  | 'schema';

export type CodexTaskPhase =
  | 'foundation-migration'
  | 'noise-materials'
  | 'post-screen-space'
  | 'compute-simulation'
  | 'polish-qa';

export type CodexTaskStatus = 'planned' | 'in-progress' | 'blocked' | 'complete';

export type CodexTaskCategory =
  | 'foundation'
  | 'noise'
  | 'materials'
  | 'post'
  | 'compute'
  | 'presets'
  | 'docs'
  | 'qa'
  | 'infrastructure';

export type CodexTaskPriority = 'critical' | 'high' | 'medium' | 'low';

const PHASES: readonly CodexTaskPhase[] = [
  'foundation-migration',
  'noise-materials',
  'post-screen-space',
  'compute-simulation',
  'polish-qa'
];

const STATUSES: readonly CodexTaskStatus[] = ['planned', 'in-progress', 'blocked', 'complete'];

const CATEGORIES: readonly CodexTaskCategory[] = [
  'foundation',
  'noise',
  'materials',
  'post',
  'compute',
  'presets',
  'docs',
  'qa',
  'infrastructure'
];

const PRIORITIES: readonly CodexTaskPriority[] = ['critical', 'high', 'medium', 'low'];

const ARTIFACT_TYPES: readonly SourceArtifactType[] = [
  'noise',
  'material',
  'post',
  'compute',
  'utility',
  'docs',
  'schema'
];

export interface CodexTaskSourceReference {
  readonly repository: string;
  readonly path: string;
  readonly artifactType: SourceArtifactType;
  readonly notes?: string;
}

export interface CodexTaskTarget {
  readonly package: string;
  readonly module: string;
  readonly exports?: ImmutableArray<string>;
  readonly schemaRef?: string;
}

export interface CodexTaskMetric {
  readonly name: string;
  readonly target: string;
  readonly measurement?: string;
}

export interface CodexTaskQA {
  readonly tests?: ImmutableArray<string>;
  readonly metrics?: ImmutableArray<CodexTaskMetric>;
}

export interface CodexTask {
  readonly id: string;
  readonly title: string;
  readonly summary?: string;
  readonly phase: CodexTaskPhase;
  readonly week: number;
  readonly category: CodexTaskCategory;
  readonly status: CodexTaskStatus;
  readonly priority?: CodexTaskPriority;
  readonly sourceReferences: ImmutableArray<CodexTaskSourceReference>;
  readonly target: CodexTaskTarget;
  readonly dependencies?: ImmutableArray<string>;
  readonly acceptanceCriteria: ImmutableArray<string>;
  readonly qa?: CodexTaskQA;
  readonly notes?: string;
  readonly tags?: ImmutableArray<string>;
}

export function getCodexTaskSchema(): unknown {
  return schema;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function assertArray<T>(value: unknown, predicate: (item: unknown) => item is T): T[] {
  if (!Array.isArray(value)) {
    throw new TypeError('Expected array');
  }

  return value.map((item) => {
    if (!predicate(item)) {
      throw new TypeError('Array element failed validation');
    }

    return item;
  });
}

function isCodexTaskSourceReference(value: unknown): value is CodexTaskSourceReference {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    isString(candidate.repository) &&
    isString(candidate.path) &&
    isString(candidate.artifactType) &&
    ARTIFACT_TYPES.includes(candidate.artifactType as SourceArtifactType)
  );
}

function isCodexTaskTarget(value: unknown): value is CodexTaskTarget {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  if (!isString(candidate.package) || !isString(candidate.module)) {
    return false;
  }

  if (candidate.exports !== undefined && !Array.isArray(candidate.exports)) {
    return false;
  }

  if (candidate.schemaRef !== undefined && !isString(candidate.schemaRef)) {
    return false;
  }

  return true;
}

function assertAcceptanceCriteria(value: unknown): string[] {
  return assertArray(value, (item): item is string => isString(item) && item.length > 0);
}

function assertDependencies(value: unknown | undefined): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  return assertArray(value, (item): item is string => isString(item));
}

function assertTags(value: unknown | undefined): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  return assertArray(value, isString);
}

export function validateCodexTask(candidate: unknown): CodexTask {
  if (typeof candidate !== 'object' || candidate === null) {
    throw new TypeError('Codex task must be an object');
  }

  const record = candidate as Record<string, unknown>;

  const id = record.id;
  const title = record.title;
  const phase = record.phase;
  const week = record.week;
  const category = record.category;
  const status = record.status;
  const priority = record.priority;
  const sourceReferences = record.sourceReferences;
  const target = record.target;
  const dependencies = record.dependencies;
  const acceptanceCriteria = record.acceptanceCriteria;
  const qa = record.qa;
  const notes = record.notes;
  const tags = record.tags;

  if (!isString(id) || !/^TSL-[0-9]{3,}$/.test(id)) {
    throw new TypeError('Invalid or missing id');
  }

  if (!isString(title) || title.length < 4) {
    throw new TypeError('Invalid or missing title');
  }

  if (!isString(phase) || !PHASES.includes(phase as CodexTaskPhase)) {
    throw new TypeError('Invalid or missing phase');
  }

  if (typeof week !== 'number' || !Number.isInteger(week)) {
    throw new TypeError('Invalid or missing week');
  }

  if (!isString(category) || !CATEGORIES.includes(category as CodexTaskCategory)) {
    throw new TypeError('Invalid or missing category');
  }

  if (!isString(status) || !STATUSES.includes(status as CodexTaskStatus)) {
    throw new TypeError('Invalid or missing status');
  }

  if (priority !== undefined) {
    if (!isString(priority) || !PRIORITIES.includes(priority as CodexTaskPriority)) {
      throw new TypeError('Priority must be one of the allowed values');
    }
  }

  if (!Array.isArray(sourceReferences)) {
    throw new TypeError('sourceReferences must be an array');
  }

  const validatedSourceReferences = sourceReferences.map((entry) => {
    if (!isCodexTaskSourceReference(entry)) {
      throw new TypeError('Invalid source reference entry');
    }

    return entry;
  });

  if (!isCodexTaskTarget(target)) {
    throw new TypeError('Invalid or missing target');
  }

  const validatedDependencies = assertDependencies(dependencies);
  const validatedAcceptanceCriteria = assertAcceptanceCriteria(acceptanceCriteria);

  let validatedQA: CodexTaskQA | undefined;
  if (qa !== undefined) {
    if (typeof qa !== 'object' || qa === null) {
      throw new TypeError('qa must be an object when provided');
    }

    const qaRecord = qa as Record<string, unknown>;
    const testsValue = qaRecord.tests;
    const metricsValue = qaRecord.metrics;

    const tests = testsValue === undefined ? undefined : assertArray(testsValue, isString);
    const metrics = metricsValue === undefined
      ? undefined
      : assertArray(metricsValue, (item): item is CodexTaskMetric => {
          if (typeof item !== 'object' || item === null) {
            return false;
          }

          const metricRecord = item as Record<string, unknown>;
          return isString(metricRecord.name) && isString(metricRecord.target) &&
            (metricRecord.measurement === undefined || isString(metricRecord.measurement));
        });

    validatedQA = { tests, metrics };
  }

  if (notes !== undefined && !isString(notes)) {
    throw new TypeError('notes must be a string when provided');
  }

  const validatedTags = assertTags(tags);

  return {
    id,
    title,
    summary: isString(record.summary) ? record.summary : undefined,
    phase: phase as CodexTaskPhase,
    week,
    category: category as CodexTaskCategory,
    status: status as CodexTaskStatus,
    priority: priority as CodexTaskPriority,
    sourceReferences: validatedSourceReferences,
    target,
    dependencies: validatedDependencies,
    acceptanceCriteria: validatedAcceptanceCriteria,
    qa: validatedQA,
    notes: notes as string | undefined,
    tags: validatedTags
  };
}
