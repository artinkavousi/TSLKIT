import type { DeviceCapabilityReport } from './deviceCapabilities';

export interface CapabilityRequirement {
  feature: GPUFeatureName | string;
  optional?: boolean;
  reason: string;
}

export function verifyCapabilities(report: DeviceCapabilityReport, requirements: CapabilityRequirement[]) {
  const missing: CapabilityRequirement[] = [];
  for (const requirement of requirements) {
    if (report.missingFeatures.includes(requirement.feature as GPUFeatureName)) {
      if (!requirement.optional) {
        missing.push(requirement);
      }
    }
  }

  if (missing.length > 0) {
    const message = missing
      .map((req) => `${req.feature}: ${req.reason}`)
      .join('\n');
    throw new Error(`WebGPU feature requirements not met:\n${message}`);
  }
}
