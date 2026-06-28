Review a spec file before implementation begins.

## Instructions

1. Ask which spec to review, or read the most recently modified file in `specs/` if none is specified.
2. Read the spec file carefully.
3. Check each of the following and report findings:

**Completeness**
- Is the Goal one clear sentence?
- Are all Inputs listed with their source?
- Are Outputs specific enough to build from?
- Are there at least 3 Acceptance Criteria?
- Is Out of Scope filled in?
- Are Open Questions empty? (If not, implementation cannot start.)

**Quality**
- Are the Acceptance Criteria testable? (Can you answer yes/no to each one?)
- Is anything ambiguous that a developer would have to guess at?
- Does the spec gold-plate or describe more than one feature?
- Are there implicit assumptions that should be stated explicitly?

**Consistency**
- Does this conflict with any other approved spec?
- Does it depend on a spec that is not yet implemented?

4. Give a clear verdict: **Ready to implement** or **Needs changes** with a specific list of what to fix.
5. If ready, tell the user to change Status to `approved` and then use `/spec-implement`.

## Rules

- Be direct. If the spec is weak, say so clearly with specific reasons.
- Do not suggest implementation details — only evaluate the spec itself.
