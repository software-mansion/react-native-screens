import fs from 'node:fs';
import path from 'node:path';

import {
  clampText,
  configurationLabel,
  detailsBlock,
  escapeSlack,
  extractVerdict,
  neutralizeForPublic,
  formatUsd,
  parseCost,
  ensureMirrorIssue,
  publishReportComment,
  readFile,
  readJsonObject,
  readScreenshots,
  requireEnv,
  screenshotsSection,
  commentFooter,
  reportForComment,
  summaryOfOutput,
  writeCommentFile,
} from './argent-cloud-report.ts';
import type { Mirror, Screenshots, Verdict } from './argent-cloud-report.ts';
import { postToSlack } from './slack.ts';

// plan-failed: the planning agent produced no plan. plan-infeasible: it declined. build-failed: the
// app did not build. reproduce: the tester ran (or tried to).
type Stage = 'plan-failed' | 'plan-infeasible' | 'build-failed' | 'reproduce';

type Context = {
  stage: Stage;
  status: string;
  issueNumber: string;
  issueTitle: string | undefined;
  issueUrl: string;
  runUrl: string;
  failedStep: string | undefined;
  reportUrl: string | undefined;
  plan: Plan | null;
  source: Source | null;
  mirror: Mirror | null;
  brief: string | null;
  output: string | null;
  stream: string | null;
  verdict: Verdict | null;
  summary: string;
  costs: Costs;
  screenshots: Screenshots | null;
};

type Plan = {
  feasible?: boolean;
  reason?: string;
  summary?: string;
  analysis?: string;
  limitations?: string | null;
  reactNativeVersion?: string;
  screensVersion?: string;
  configuration?: string;
  appKind?: string;
  reproductionSource?: {
    kind?: string;
    url?: string | null;
    copiedFrom?: string[];
  };
  reproductionSteps?: string[];
  verification?: {
    kind?: string;
    how?: string;
    passSignal?: string;
    failSignal?: string;
  };
  expectedBehavior?: string;
  actualBehavior?: string;
};

type Source = {
  kind?: string;
  url?: string | null;
  fetched?: boolean;
  commit?: string;
  ref?: string;
  path?: string;
  file?: string;
};

type Costs = { plan: number; reproduction: number; total: number };

async function main(): Promise<void> {
  const command = process.argv[2];
  switch (command) {
    case 'mirror':
      await mirror();
      break;
    case 'report':
      writeReport(readContext());
      break;
    case 'publish':
      await publish(readContext());
      break;
    case 'notify':
      await notify(readContext());
      break;
    case 'comment':
      writeComment(readContext());
      break;
    default:
      throw new Error(
        `usage: argent-cloud-issue-repro-report.ts <report|publish|notify|comment>, got '${
          command ?? ''
        }'`,
      );
  }
}

// Every file lives under WORK_DIR with a fixed name; an explicit *_FILE env overrides it.
function workFile(name: string, env: string): string | undefined {
  if (process.env[env]) {
    return process.env[env];
  }
  return process.env.WORK_DIR ? path.join(process.env.WORK_DIR, name) : undefined;
}

function readContext(): Context {
  const stage = (process.env.STAGE ?? 'reproduce') as Stage;
  const plan = readJsonObject<Plan>(workFile('plan.json', 'PLAN_FILE'));
  const source = readJsonObject<Source>(workFile('source.json', 'SOURCE_FILE'));
  const output = readFile(workFile('output/output.md', 'OUTPUT_FILE'));
  const planCost = parseCost(process.env.PLAN_COST_USD);
  const reproductionCost = parseCost(process.env.REPRO_COST_USD);
  const verdict = output ? extractVerdict(output) : null;
  return {
    stage,
    status: process.env.STATUS ?? 'unknown',
    issueNumber: requireEnv('ISSUE_NUMBER'),
    issueTitle: process.env.ISSUE_TITLE || undefined,
    issueUrl: requireEnv('ISSUE_URL'),
    runUrl: requireEnv('RUN_URL'),
    failedStep: process.env.FAILED_STEP || undefined,
    reportUrl: process.env.REPORT_URL || undefined,
    plan,
    source,
    mirror: readJsonObject<Mirror>(workFile('mirror.json', 'MIRROR_FILE')),
    brief: readFile(workFile('brief.md', 'BRIEF_FILE')),
    output,
    stream: readFile(workFile('output/stream.md', 'STREAM_FILE')),
    verdict,
    summary: summaryText(stage, plan, output),
    costs: {
      plan: planCost,
      reproduction: reproductionCost,
      total: planCost + reproductionCost,
    },
    screenshots: readScreenshots(
      process.env.SCREENSHOTS_DIR,
      process.env.SCREENSHOTS_URL,
    ),
  };
}

function summaryText(
  stage: Stage,
  plan: Plan | null,
  output: string | null,
): string {
  if (stage === 'plan-failed') {
    return 'The planning agent produced no plan. See the run logs.';
  }
  if (stage === 'plan-infeasible') {
    return clampText(
      `Not attempted. ${plan?.reason ?? 'The agent produced no reason.'}`,
    );
  }
  if (stage === 'build-failed') {
    return 'The reproduction app could not be built. See the run logs.';
  }
  if (!output) {
    return 'The reproduction agent produced no output. See the run logs.';
  }
  return clampText(summaryOfOutput(output));
}

function sourceLabel(context: Context): string {
  const source = context.source;
  if (!source || !source.kind || source.kind === 'none') {
    return 'none linked';
  }
  const parts = [source.kind];
  if (source.url) {
    parts.push(source.url);
  }
  if (source.kind === 'repository' || source.kind === 'gist') {
    // The commit says what the agent read: a branch link can move after a maintainer looked at it.
    parts.push(
      source.fetched === false
        ? 'could not be fetched'
        : `fetched read-only${
            source.commit ? ` at commit ${source.commit}` : ''
          }`,
    );
  }
  return parts.join(', ');
}

function writeReport(context: Context): void {
  const reportFile = workFile('report.md', 'REPORT_FILE') ?? requireEnv('REPORT_FILE');
  const lines: string[] = [];
  lines.push(`## Argent Cloud run: ${outcomeLabel(context)}`, '');
  lines.push('| | |', '|---|---|');
  lines.push(`| Outcome | ${outcomeLabel(context)} |`);
  lines.push(`| Issue | ${context.issueUrl} |`);
  lines.push(`| Workflow run | ${context.runUrl} |`);
  if (context.failedStep) {
    lines.push(`| Failed step | ${context.failedStep} |`);
  }
  lines.push(`| Linked reproduction | ${sourceLabel(context)} |`);
  if (context.plan) {
    lines.push(
      `| React Native | ${context.plan.reactNativeVersion ?? 'unknown'} |`,
    );
    lines.push(`| Screens | ${context.plan.screensVersion ?? 'unknown'} |`);
    lines.push(
      `| App | ${
        context.plan.appKind ?? 'unknown'
      } scaffold, iOS simulator, ${configurationLabel(
        context.plan.configuration,
      )} |`,
    );
    if (context.plan.reproductionSource) {
      lines.push(
        `| Code in the app | ${
          context.plan.reproductionSource.kind ?? 'unknown'
        }${
          context.plan.reproductionSource.copiedFrom?.length
            ? `, from ${context.plan.reproductionSource.copiedFrom
                .map(file => `\`${file}\``)
                .join(', ')}`
            : ''
        } |`,
      );
    }
  }
  lines.push(`| Cost | ${costLine(context.costs)} |`, '');

  lines.push('## Summary', '', context.summary, '');

  if (context.output) {
    lines.push('## Reproduction result', '', context.output, '');
  }

  if (context.screenshots) {
    lines.push(...screenshotsSection('## Screenshots', context.screenshots));
  }

  if (context.plan) {
    lines.push('## Reproduction plan', '');
    if (context.plan.summary) {
      lines.push(context.plan.summary, '');
    }
    const steps = context.plan.reproductionSteps ?? [];
    if (steps.length > 0) {
      lines.push(
        '### Steps',
        '',
        ...steps.map((step, index) => `${index + 1}. ${step}`),
        '',
      );
    }
    const verification = context.plan.verification;
    if (verification) {
      lines.push('### Verification', '');
      lines.push(`- Kind: ${verification.kind ?? 'unknown'}`);
      lines.push(`- How: ${verification.how ?? ''}`);
      lines.push(`- Pass: ${verification.passSignal ?? ''}`);
      lines.push(`- Fail: ${verification.failSignal ?? ''}`, '');
    }
    if (context.plan.expectedBehavior) {
      lines.push('### Expected', '', context.plan.expectedBehavior, '');
    }
    if (context.plan.actualBehavior) {
      lines.push('### Actual', '', context.plan.actualBehavior, '');
    }
    if (context.plan.limitations) {
      lines.push('### Limitations', '', context.plan.limitations, '');
    }
    if (context.plan.analysis) {
      lines.push('### Analysis', '', context.plan.analysis, '');
    }
  }

  if (context.brief) {
    lines.push(
      '## Brief given to the tester',
      '',
      ...detailsBlock('Full brief', context.brief),
      '',
    );
  }
  if (context.plan) {
    lines.push(
      '## Plan JSON',
      '',
      ...detailsBlock(
        'plan.json',
        ['```json', JSON.stringify(context.plan, null, 2), '```'].join('\n'),
      ),
      '',
    );
  }

  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(reportFile, lines.join('\n'));
  console.log(`wrote ${reportFile}`);
}

function writeComment(context: Context): void {
  const publicComment = process.env.PUBLIC_COMMENT === 'true';
  // Agent text (the summary, the plan's fields, the report) is neutralized for the public issue
  // one piece at a time; the headings, the table, the details wrapper and the footer are this
  // script's own HTML and Markdown and must stay intact, so they are never passed through it.
  const untrusted = (text: string): string =>
    publicComment ? neutralizeForPublic(text) : text;
  const lines = [
    '## Argent Cloud reproduction',
    '',
    `An AI agent tried to reproduce ${
      context.issueUrl
    } in a small app on an iOS simulator. Verdict: **${outcomeLabel(
      context,
    )}**.`,
    '',
    untrusted(context.summary),
    '',
  ];
  if (context.plan) {
    lines.push(
      '| | |',
      '|---|---|',
      `| React Native | ${untrusted(context.plan.reactNativeVersion ?? 'unknown')} |`,
      `| Screens | ${untrusted(context.plan.screensVersion ?? 'unknown')} |`,
      `| App | ${untrusted(
        context.plan.appKind ?? 'unknown',
      )} scaffold, ${configurationLabel(context.plan.configuration)} |`,
      '',
    );
  }
  if (context.output) {
    lines.push(
      ...detailsBlock(
        'Report of the agent',
        reportForComment(context.output, publicComment),
      ),
      '',
    );
  }
  lines.push(...commentFooter(context.runUrl), '');
  if (context.screenshots) {
    lines.push(
      `The agent took ${context.screenshots.files.length} screenshot(s). They follow below in the order it took them.`,
      '',
    );
  }
  writeCommentFile(lines);
}

// Creates the mirror of the original issue in the reports repository when it does not exist yet,
// and writes its number and URL to MIRROR_FILE for the later jobs.
async function mirror(): Promise<void> {
  const issue = readJsonObject<{
    number?: number;
    title?: string;
    html_url?: string;
    body?: string | null;
    user?: { login?: string } | null;
    created_at?: string;
  }>(workFile('issue.json', 'ISSUE_FILE') ?? requireEnv('ISSUE_FILE'));
  if (!issue || !issue.number || !issue.html_url) {
    throw new Error('ISSUE_FILE does not hold an issue payload');
  }
  const result = await ensureMirrorIssue({
    origin: requireEnv('ORIGIN_REPOSITORY'),
    issueNumber: String(issue.number),
    issueTitle: issue.title ?? '',
    issueUrl: issue.html_url,
    issueBody: issue.body ?? '',
    author: issue.user?.login ?? 'unknown',
    createdAt: issue.created_at ?? '',
  });
  const mirrorFile = workFile('mirror.json', 'MIRROR_FILE') ?? requireEnv('MIRROR_FILE');
  fs.mkdirSync(path.dirname(mirrorFile), { recursive: true });
  fs.writeFileSync(mirrorFile, JSON.stringify(result, null, 2) + '\n');
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `number=${result.number}\nurl=${result.url}\n`,
    );
  }
}

async function publish(context: Context): Promise<void> {
  if (!context.mirror) {
    throw new Error(
      'MIRROR_FILE is missing, so there is no issue to report under',
    );
  }
  const url = await publishReportComment({
    mirror: context.mirror,
    streams: context.stream
      ? [{ name: 'Agent stream', content: context.stream }]
      : [],
  });
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `url=${url}\n`);
  }
}

async function notify(context: Context): Promise<void> {
  const lines = [
    `${outcomeEmoji(context)} Argent Cloud repro ${outcomeLabel(
      context,
    )}: ${escapeSlack(issueLabel(context))}`,
  ];
  lines.push(`Summary: ${escapeSlack(context.summary)}`);
  if (context.failedStep) {
    lines.push(`Failed step: ${escapeSlack(context.failedStep)}`);
  }
  lines.push(`Cost: ${costLine(context.costs)}`);
  if (context.reportUrl) {
    lines.push(`Report: ${context.reportUrl}`);
  }
  if (context.screenshots?.artifactUrl) {
    lines.push(`Screenshots: ${context.screenshots.artifactUrl}`);
  }
  lines.push(`Issue: ${context.issueUrl}`, `Run: ${context.runUrl}`);
  await postToSlack({ text: lines.join('\n') });
}

function outcomeLabel(context: Context): string {
  switch (context.stage) {
    case 'plan-failed':
      return 'plan failed';
    case 'plan-infeasible':
      return 'skipped';
    case 'build-failed':
      return 'build failed';
    default:
      return (
        context.verdict?.toLowerCase() ??
        (context.status === 'success' ? 'no verdict' : context.status)
      );
  }
}

function outcomeEmoji(context: Context): string {
  if (context.stage === 'plan-failed') {
    return '🔴';
  }
  if (context.stage === 'plan-infeasible') {
    return '⚪';
  }
  if (context.stage === 'build-failed') {
    return '🔴';
  }
  switch (context.verdict) {
    case 'REPRODUCIBLE':
      return '🟢';
    case 'NOT REPRODUCIBLE':
      return '🟠';
    case 'FALSE ISSUE':
      return '⚪';
    case 'BLOCKED':
      return '🔴';
    default:
      return '🔴';
  }
}

function issueLabel(context: Context): string {
  return context.issueTitle
    ? `#${context.issueNumber} — ${context.issueTitle}`
    : `#${context.issueNumber}`;
}

function costLine(costs: Costs): string {
  const parts = [`plan ${formatUsd(costs.plan)}`];
  if (costs.reproduction > 0) {
    parts.push(`reproduction ${formatUsd(costs.reproduction)}`);
  }
  return `${formatUsd(costs.total)} (${parts.join(', ')})`;
}

main().catch((err: unknown) => {
  console.error('argent-cloud-issue-repro-report failed:', err);
  process.exitCode = 1;
});
