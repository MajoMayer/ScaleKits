Validate that an implementation matches its spec's acceptance criteria.

## Instructions

1. Ask which spec to validate, or use the most recently implemented spec in `specs/`.
2. Read the spec file and the implementation code.
3. Go through each Acceptance Criterion one by one:
   - State the criterion
   - Check if the implementation satisfies it (yes / no / partial)
   - If no or partial, describe exactly what is missing
4. Give a final verdict:
   - **PASS** — all criteria met, change Status to `validated`
   - **FAIL** — list which criteria failed and what needs to be fixed

5. If there are failures: do NOT fix them silently. Show the list to the user and ask: "Should I fix these now, or do you want to update the spec first?"

## Rules

- Validate against the spec, not against what "seems right."
- If the implementation does something the spec doesn't mention (even if useful), flag it as out-of-spec — not as a pass.
- Be specific: "Criterion 3 fails because the filter UI is missing" not just "filters don't work."
