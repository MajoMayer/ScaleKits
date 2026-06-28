Implement a feature from an approved spec.

## Instructions

1. Ask which spec to implement, or use the most recently approved spec in `specs/`.
2. Read the spec file. Verify Status is `approved` — if not, stop and say: "This spec is not approved yet. Run /spec-review first."
3. Confirm Open Questions is empty — if not, stop and list the unresolved questions.
4. Implement exactly what the spec describes:
   - Use the Inputs and Outputs sections as your contract
   - Each Acceptance Criterion should be satisfied by the implementation
   - Do not add features, options, or improvements not in the spec
5. After implementation, add a brief note under "Implementation notes" in the spec file.
6. Tell the user: "Implementation done. Run /spec-validate to check it against the acceptance criteria."

## Rules

- If you discover a gap in the spec during implementation, STOP. Update the spec and get approval — do not fill the gap silently.
- Implement the minimum code that satisfies the spec. No more.
- Explain what you built in plain language after finishing — no jargon.
