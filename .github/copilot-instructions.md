---
applyTo: '**'
---
# this project - Copilot Instructions

> **MEMORY ENFORCEMENT**: These instructions MUST be loaded and followed for ALL interactions with this codebase.

## Project Overview

This project uses **Mayor West Mode** for autonomous GitHub Copilot development workflows.

## Key Rules

1. **Commit Format**: `[MAYOR] <description>`
2. **Test Before Commit**: Always run `npm test` before committing
3. **No Destructive Commands**: Never use `rm -rf`, `git reset --hard`, etc.
4. **PR Format**: Include `Fixes #<issue-number>` in PR body

## Agent Hierarchy

Consult the appropriate agent file for specialized tasks:
- `.github/agents/mayor-west-mode.md` - Primary agent protocol
- `AGENTS.md` - Agent overview and delegation

## Quick Reference

```bash
# Development
npm install
npm test
npm run lint

# Create a task
# GitHub → Issues → New → Mayor Task template
```
