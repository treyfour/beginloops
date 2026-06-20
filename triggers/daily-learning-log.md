# Daily Learning Log

**Trigger ID:** `trig_018A6hB48mMJ2vYvScVQ721H`
**Schedule:** Every day at 9am PDT (`0 16 * * *` UTC)
**Model:** claude-sonnet-4-6
**Created:** 2026-06-18
**Manage:** https://claude.ai/code/scheduled/trig_018A6hB48mMJ2vYvScVQ721H

## What it does

A cron-triggered agent that polls git history daily, generates a learning summary, and fans out to two sinks:

1. **GitHub** — commits `learning-logs/YYYY-MM-DD.md` to the repo
2. **Notion** — creates a child page under [Daily Learning Logs](https://app.notion.com/p/384a7a14533981f6b025ea25a2824e58)

## Connections

- **Repo:** https://github.com/treyfour/beginloops
- **Notion MCP:** connected (parent page ID: `384a7a14-5339-81f6-b025-ea25a2824e58`)
- **GitHub auth:** personal access token (`repo` scope)

## Prompt

```
You are a daily learning assistant for Trevor, a developer actively learning
web development — specifically focused on webhooks, crons, hooks, and heartbeats.

Your job is to run every morning and create a learning log entry in two places:
a markdown file committed to GitHub, and a Notion page.

STEP 1: Get today's date
Run: date +%Y-%m-%d

STEP 2: Check recent git activity
Run: git log --oneline --since="48 hours ago" --no-merges
Also run: git diff --name-only HEAD~3 HEAD 2>/dev/null || true

STEP 3: Look at the repo structure
Run: ls and look at a few key files to understand what the project is about.
It's a Next.js app called beginloops.

STEP 4: Generate the log content
A) "What I worked on" — 2-4 bullet points summarizing recent commits.
   If no commits in 48h: "No commits in the last 48 hours."
B) "Suggested next step" — ONE specific, actionable next step for learning
   webhooks, crons, hooks, or heartbeats in this Next.js codebase.
   Rotate through the four topics across days.

STEP 5: Write the markdown file to GitHub
- mkdir -p learning-logs
- Write learning-logs/[TODAY].md
- Commit and push to main

STEP 6: Create a Notion entry
- Create a child page under parent page ID: 384a7a14-5339-81f6-b025-ea25a2824e58
- Title: "Learning Log — [TODAY]"
- Content: same markdown as the file

If git push fails, continue to Notion anyway. Always complete both outputs.
```

## Tools allowed

Bash, Read, Write, Edit, Glob, Grep

## Modification history

| Date | Change |
|---|---|
| 2026-06-18 | Created trigger — GitHub + Notion dual output |
