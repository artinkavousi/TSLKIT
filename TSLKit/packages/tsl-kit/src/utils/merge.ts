export type MergeableRecord = Record<string, unknown>;

const isObject = (value: unknown): value is MergeableRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const merge = <T extends MergeableRecord>(
  base: Partial<T> | undefined,
  override: Partial<T> | undefined
): Partial<T> => {
  if (!base && !override) {
    return {};
  }

  if (!base) {
    return { ...(override as MergeableRecord) };
  }

  if (!override) {
    return { ...(base as MergeableRecord) };
  }

  const result: MergeableRecord = { ...(base as MergeableRecord) };

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) {
      continue;
    }

    const current = result[key];
    result[key] = isObject(current) && isObject(value) ? merge(current, value) : value;
  }

  return result as Partial<T>;
};
