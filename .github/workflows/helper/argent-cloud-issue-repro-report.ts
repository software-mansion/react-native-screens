import fs from 'node:fs';
import path from 'node:path';

import {
  clampText,
  configurationLabel,
  detailsBlock,
  escapeSlack,
  extractVerdict,
  formatUsd,
  neutralizeAgentText,
  parseCost,
  ensureMirrorIssue,
  publishReportComment,
  readFile,
  readJsonObject,
  readScreenshots,
  requireEnv,
  SCREENSHOTS_PLACEHOLDER,
  stripSessionId,
  summaryOfOutput,
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
  reportUrl: string | null;
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
    default:
      throw new Error(
        `usage: argent-cloud-issue-repro-report.ts <mirror|report|publish|notify>, got '${
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
  // The output, the stream and the brief are agent text, so they are neutralized here, once; the
  // plan is neutralized where the report renders it. The summary and the verdict are read from the
  // output before that.
  const rawOutput = readFile(workFile('output/output.md', 'OUTPUT_FILE'));
  const stripped = rawOutput ? stripSessionId(rawOutput).trim() || null : null;
  const output = stripped ? neutralizeAgentText(stripped) : null;
  const stream = readFile(workFile('output/stream.md', 'STREAM_FILE'));
  const brief = readFile(workFile('brief.md', 'BRIEF_FILE'));
  const planCost = parseCost(process.env.PLAN_COST_USD);
  const reproductionCost = parseCost(process.env.REPRO_COST_USD);
  const verdict = stripped ? extractVerdict(stripped) : null;
  return {
    stage,
    status: process.env.STATUS ?? 'unknown',
    issueNumber: requireEnv('ISSUE_NUMBER'),
    issueTitle: process.env.ISSUE_TITLE || undefined,
    issueUrl: requireEnv('ISSUE_URL'),
    runUrl: requireEnv('RUN_URL'),
    failedStep: process.env.FAILED_STEP || undefined,
    reportUrl: readFile(workFile('report-url.txt', 'REPORT_URL_FILE')),
    plan,
    source,
    mirror: readJsonObject<Mirror>(workFile('mirror.json', 'MIRROR_FILE')),
    brief: brief ? neutralizeAgentText(brief) : null,
    output,
    stream: stream ? neutralizeAgentText(stripSessionId(stream)) : null,
    verdict,
    summary: summaryText(stage, plan, stripped),
    costs: {
      plan: planCost,
      reproduction: reproductionCost,
      total: planCost + reproductionCost,
    },
    screenshots: readScreenshots(process.env.SCREENSHOTS_DIR),
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

function neutralizeStrings<T>(value: T): T {
  if (typeof value === 'string') {
    return neutralizeAgentText(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map(item => neutralizeStrings(item)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, neutralizeStrings(item)]),
    ) as T;
  }
  return value;
}

function writeReport(original: Context): void {
  const reportFile = workFile('report.md', 'REPORT_FILE') ?? requireEnv('REPORT_FILE');
  // The plan's strings and the summary are agent text; the plan JSON below is shown raw, inside a
  // code fence that a JSON string cannot close, because JSON escapes line breaks.
  const context: Context = {
    ...original,
    summary: neutralizeAgentText(original.summary),
    plan: original.plan ? neutralizeStrings(original.plan) : null,
  };
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

  // The screenshots go right after the agent's report, which refers to them by number.
  lines.push(SCREENSHOTS_PLACEHOLDER, '');

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
        ['```json', JSON.stringify(original.plan, null, 2), '```'].join('\n'),
      ),
      '',
    );
  }

  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(reportFile, lines.join('\n'));
  console.log(`wrote ${reportFile}`);
}

// Creates the mirror of the original issue in the reports repository when it does not exist yet,
// and writes its number to MIRROR_FILE and to the step outputs for the later jobs. Its URL names
// the reports repository, so it is never an output. The issue is read from the event payload of the
// run, never from the plan artifact, so a planning agent that escaped its sandbox cannot point the
// reports at another issue's mirror.
async function mirror(): Promise<void> {
  type Issue = {
    number?: number;
    title?: string;
    html_url?: string;
    body?: string | null;
    user?: { login?: string } | null;
    created_at?: string;
  };
  const event = readJsonObject<{ issue?: Issue }>(
    process.env.GITHUB_EVENT_PATH ?? requireEnv('ISSUE_EVENT_FILE'),
  );
  const issue = event?.issue;
  if (!issue || !issue.number || !issue.html_url) {
    throw new Error('the event payload holds no issue');
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
      `number=${result.number}\n`,
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
    screenshots: context.screenshots,
    screenshotsPrefix: `issue-${context.issueNumber}/run-${requireEnv(
      'GITHUB_RUN_ID',
    )}-${process.env.GITHUB_RUN_ATTEMPT ?? '1'}`,
  });
  // The URL names the reports repository, so it goes to the Slack step through a file: a step
  // output passed in `env` would be printed in the public log of that step.
  if (url) {
    fs.writeFileSync(
      workFile('report-url.txt', 'REPORT_URL_FILE') ??
        requireEnv('REPORT_URL_FILE'),
      `${url}\n`,
    );
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
