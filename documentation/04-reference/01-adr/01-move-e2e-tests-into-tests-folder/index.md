# Move e2e tests into the tests folder

## Status

Accepted

## Context

All end-to-end tests lived in a top-level `e2e/` folder. There was no place to put unit
tests next to their related e2e tests, and no shared folder that groups all types of
tests together.

## Decision

The `e2e/` folder was moved to `tests/e2e/`. This makes `tests/` the single top-level
folder for all tests, so unit tests can be added alongside the e2e tests, for example
in `tests/unit/`.

The following files were updated to point to the new location:

- `playwright.config.ts`: `testDir` now points to `./tests/e2e`.
- `tsconfig.json`: the `@/*` path alias and the `include` array now reference
  `./tests/e2e`.
- `include-tldr-component.md`: file paths and commands referencing `e2e/` were updated
  to `tests/e2e/`.

## Consequences

- Unit tests can be added under `tests/unit` without mixing them with e2e tests or
  needing a new top-level folder.
- Any documentation, scripts, or CI configuration that hardcodes the `e2e/` path
  instead of relying on `playwright.config.ts` needs to be updated to `tests/e2e/`.
