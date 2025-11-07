export interface ProvenanceEntry {
  readonly source: string;
  readonly path: string;
  readonly license: string;
  readonly notes?: string;
}

export interface ProvenanceManifest {
  readonly moduleId: string;
  readonly entries: readonly ProvenanceEntry[];
}

export function createProvenanceManifest(moduleId: string, entries: readonly ProvenanceEntry[]): ProvenanceManifest {
  return {
    moduleId,
    entries: entries.map((entry) => ({ ...entry }))
  };
}
