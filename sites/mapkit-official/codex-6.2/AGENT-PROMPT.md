Draw me an illustrated map of Italy with handdrawn-map-kit.

Run git clone https://github.com/wangreng/handdrawn-map-kit, then cd handdrawn-map-kit and run npm ci.

Read SKILL.md. Create the parent directory and copy SKILL.md to the path for your agent:
- Claude Code: ~/.claude/skills/handdrawn-map-kit/SKILL.md
- Codex: ~/.agents/skills/handdrawn-map-kit/SKILL.md
- Cursor: .cursor/skills/handdrawn-map-kit/SKILL.md in the active project

From the cloned repo, run:
node bin/cli.js render examples/specs/italy.yaml --fast --auto-layout -o out/italy.png --diagnostics out/italy.diag.json

Show me the map and summarize any layout collisions or out-of-bounds items.
