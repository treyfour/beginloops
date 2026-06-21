import { NextRequest, NextResponse } from "next/server";

interface PushEvent {
  ref: string;
  before: string;
  after: string;
  pusher: { name: string; email: string };
  commits: Array<{
    id: string;
    message: string;
    timestamp: string;
    author: { name: string; username: string };
    added: string[];
    removed: string[];
    modified: string[];
  }>;
  repository: { full_name: string; html_url: string };
}

function parsePushEvent(body: PushEvent) {
  const branch = body.ref.replace("refs/heads/", "");
  const commits = body.commits ?? [];

  return {
    event: "push",
    repo: body.repository.full_name,
    branch,
    pusher: body.pusher.name,
    before: body.before?.slice(0, 7),
    after: body.after?.slice(0, 7),
    commits: commits.map((c) => ({
      sha: c.id.slice(0, 7),
      message: c.message.split("\n")[0],
      author: c.author.username,
      timestamp: c.timestamp,
      files: {
        added: c.added,
        removed: c.removed,
        modified: c.modified,
      },
    })),
  };
}

export async function POST(req: NextRequest) {
  const event = req.headers.get("x-github-event") ?? "unknown";
  const body = await req.json();

  if (event === "push") {
    const summary = parsePushEvent(body);
    console.log(`\n── push ─ ${summary.repo} ─ ${summary.branch} ──`);
    console.log(`   by: ${summary.pusher}`);
    console.log(`   ${summary.before} → ${summary.after}`);
    for (const c of summary.commits) {
      console.log(`   ${c.sha} ${c.message}`);
      if (c.files.added.length) console.log(`     + ${c.files.added.join(", ")}`);
      if (c.files.modified.length) console.log(`     ~ ${c.files.modified.join(", ")}`);
      if (c.files.removed.length) console.log(`     - ${c.files.removed.join(", ")}`);
    }
    return NextResponse.json(summary);
  }

  // For any other event type, just log it raw
  console.log(`\n── ${event} ──`);
  console.log(JSON.stringify(body, null, 2));
  return NextResponse.json({ event, received: true });
}
