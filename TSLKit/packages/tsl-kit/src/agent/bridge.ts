import { z } from 'zod';
import { computeSpecSchema, materialSpecSchema, postChainSpecSchema, presetSchema } from '../schemas/index.js';
import {
  applyPreset,
  makeMaterial,
  makePostChain,
  runCompute,
  type ComputeHandle,
  type MaterialHandle,
  type PostChainHandle,
  type PresetApplicationResult
} from '../registry.js';

const makeMaterialCommandSchema = z.object({
  command: z.literal('makeMaterial'),
  payload: materialSpecSchema
});

const makePostChainCommandSchema = z.object({
  command: z.literal('makePostChain'),
  payload: postChainSpecSchema
});

const runComputeCommandSchema = z.object({
  command: z.literal('runCompute'),
  payload: computeSpecSchema
});

const applyPresetCommandSchema = z.object({
  command: z.literal('applyPreset'),
  preset: z.union([z.string().min(1), presetSchema]),
  overrides: z.unknown().optional()
});

export const agentCommandSchema = z.discriminatedUnion('command', [
  makeMaterialCommandSchema,
  makePostChainCommandSchema,
  runComputeCommandSchema,
  applyPresetCommandSchema
]);

export type AgentCommandInput = z.input<typeof agentCommandSchema>;
export type AgentCommand = z.output<typeof agentCommandSchema>;

export type AgentIssue = {
  path: (string | number)[];
  message: string;
  code?: string;
};

type AgentSuccessBase<TCommand extends AgentCommand['command'], THandle> = {
  ok: true;
  command: TCommand;
  handle: THandle;
  summary: string;
  issuedAt: string;
};

export type AgentSuccess =
  | (AgentSuccessBase<'makeMaterial', MaterialHandle> & { spec: MaterialHandle['spec'] })
  | (AgentSuccessBase<'makePostChain', PostChainHandle> & { spec: PostChainHandle['spec'] })
  | (AgentSuccessBase<'runCompute', ComputeHandle> & { spec: ComputeHandle['spec'] })
  | (AgentSuccessBase<'applyPreset', MaterialHandle | PostChainHandle | ComputeHandle> & {
      spec: MaterialHandle['spec'] | PostChainHandle['spec'] | ComputeHandle['spec'];
      preset: PresetApplicationResult['preset'];
      target: PresetApplicationResult['preset']['target'];
    });

export type AgentFailure = {
  ok: false;
  issuedAt: string;
  errors: AgentIssue[];
  command?: AgentCommand['command'];
};

export type AgentResponse = AgentSuccess | AgentFailure;

export interface AgentBridgeOptions {
  summarizer?: (input: { command: AgentCommand['command']; handleSummary: string; presetLabel?: string }) => string;
}

function formatIssues(issues: z.ZodIssue[]): AgentIssue[] {
  return issues.map((issue) => ({
    path: issue.path,
    message: issue.message,
    code: issue.code
  }));
}

function runtimeIssue(error: unknown): AgentIssue {
  if (error instanceof Error) {
    return { path: [], message: error.message };
  }

  return { path: [], message: String(error) };
}

export class AgentBridge {
  constructor(private readonly options: AgentBridgeOptions = {}) {}

  static get schema() {
    return agentCommandSchema;
  }

  execute(input: unknown): AgentResponse {
    const issuedAt = new Date().toISOString();
    const parsed = agentCommandSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, issuedAt, errors: formatIssues(parsed.error.issues) };
    }

    const command = parsed.data;

    try {
      switch (command.command) {
        case 'makeMaterial': {
          const handle = makeMaterial(command.payload);
          return this.success('makeMaterial', handle.summary, issuedAt, handle.spec, handle);
        }
        case 'makePostChain': {
          const handle = makePostChain(command.payload);
          return this.success('makePostChain', handle.summary, issuedAt, handle.spec, handle);
        }
        case 'runCompute': {
          const handle = runCompute(command.payload);
          return this.success('runCompute', handle.summary, issuedAt, handle.spec, handle);
        }
        case 'applyPreset': {
          const result = applyPreset(command.preset, command.overrides);
          const summary = this.buildSummary('applyPreset', result.handle.summary, result.preset.label ?? result.preset.id);
          return {
            ok: true,
            command: 'applyPreset',
            handle: result.handle,
            preset: result.preset,
            target: result.preset.target,
            spec: result.handle.spec,
            summary,
            issuedAt
          };
        }
        default:
          return { ok: false, issuedAt, errors: [{ path: [], message: 'Unknown command' }] };
      }
    } catch (error) {
      return { ok: false, issuedAt, errors: [runtimeIssue(error)], command: command.command };
    }
  }

  private success<THandle extends MaterialHandle | PostChainHandle | ComputeHandle>(
    command: AgentCommand['command'],
    handleSummary: string,
    issuedAt: string,
    spec: THandle['spec'],
    handle: THandle
  ): AgentSuccess {
    const summary = this.buildSummary(command, handleSummary);
    return {
      ok: true,
      command: command as AgentSuccess['command'],
      handle,
      spec,
      summary,
      issuedAt
    } as AgentSuccess;
  }

  private buildSummary(
    command: AgentCommand['command'],
    handleSummary: string,
    presetLabel?: string
  ): string {
    if (this.options.summarizer) {
      return this.options.summarizer({ command, handleSummary, presetLabel });
    }

    const prefix = command === 'applyPreset' && presetLabel ? `applyPreset:${presetLabel}` : command;
    return `${prefix} → ${handleSummary}`;
  }
}

export function createAgentBridge(options?: AgentBridgeOptions) {
  return new AgentBridge(options);
}
