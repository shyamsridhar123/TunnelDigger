# Project - Agent Instructions

> **MANDATORY ENFORCEMENT**: This file is automatically loaded for ALL AI interactions in this workspace.

## Project Identity

This project uses **Mayor West Mode** - autonomous GitHub Copilot development workflows.

## Agent Hierarchy

| Pattern | Agent | Location |
|---------|-------|----------|
| `**` | Mayor West Mode | `.github/agents/mayor-west-mode.md` |

## Mandatory Rules

1. **Never auto-approve destructive commands**: `rm`, `kill`, `reset --hard`
2. **Always run tests before committing**
3. **Use commit format**: `[MAYOR] <description>`
4. **Include `Fixes #<issue>` in PR body**

## Development Commands

```bash
npm install           # Install dependencies
npm test              # Run tests
npm run lint          # Lint code
```
