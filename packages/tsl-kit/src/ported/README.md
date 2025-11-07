# Ported Modules

This directory will mirror the source repositories listed in the PRD. Each
sub-directory keeps the original structure of the upstream example to minimize
drift during updates. Adapter layers live outside `ported/` and re-export typed
builders while preserving provenance metadata.
