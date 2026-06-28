Run a retrospective review of the SDD process at a natural milestone.

## Instructions

1. Read all files in `specs/` to understand what was built and how.
2. Read `CLAUDE.md` to recall the intended SDD rules.
3. Review the evidence across all specs and produce a structured retrospective report.

### The report must cover:

**What we built**
- List all specs with their current status and a one-line summary.
- State the total number of implemented features and kits in the collection.

**SDD process — what worked**
- Were specs written before implementation in every case?
- Were Open Questions resolved before implementation started?
- Did specs stay stable, or did they need mid-implementation changes? Why?
- Did the spec structure (Goal / Inputs / Outputs / AC / Out of Scope) prove useful?

**SDD process — what didn't work**
- Were any gaps discovered during implementation that should have been in the spec?
- Was anything implemented that wasn't in the spec (gold-plating)?
- Were any specs too vague, too detailed, or the wrong size?
- Were any Acceptance Criteria untestable or missing?

**Lessons for next specs**
- Specific, actionable suggestions for improving the spec quality on this project.
- Flag any recurring patterns (e.g. "data pipeline gaps appear in every spec").

**Milestone assessment**
- Is the project ready to proceed to the next milestone (e.g. deployment)?
- What — if anything — should be resolved or validated before moving on?

4. End with a verdict: **Ready for next milestone** or **Address these first:** followed by a short list.

## Rules

- Be honest. If the SDD process was not followed perfectly, say so — that's the point of a retro.
- Base findings only on evidence in the specs and implementation notes — do not speculate.
- Keep the report concise. Bullet points over paragraphs.
- Do not suggest new features — only evaluate the process and milestone readiness.
