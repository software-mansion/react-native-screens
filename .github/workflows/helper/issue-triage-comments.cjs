// Turns the triage labels applied by CodeRabbit into comments, replacing the
// responses that used to be sent by software-mansion-labs/swmansion-bot.
//
// One comment per label: a run only ever touches the comment belonging to the
// label that triggered it.
//
// Invoked from .github/workflows/issue-triage-comments.yml via actions/github-script.

const greeting = (author) => `Hey @${author}! 👋`;

const RESPONSES = {
  'missing-repro': {
    marker: '<!-- rns-triage:missing-repro -->',
    body: [
      "The issue doesn't seem to contain a [minimal reproduction](https://stackoverflow.com/help/minimal-reproducible-example).",
      '',
      'Could you provide a [snack](https://snack.expo.dev/) or a link to a GitHub repository under your username that reproduces the problem?',
    ].join('\n'),
  },
  'missing-info': {
    marker: '<!-- rns-triage:missing-info -->',
    body: [
      'Some of the required information in this issue is missing, incomplete or invalid. Could you take another look at the template and make sure each of these is filled in with something we can act on?',
      '',
      '- **Description** - what happens, and what you expected to happen instead',
      '- **Steps to reproduce** - steps somebody else can follow, not just numbering',
      '- **Snack or a link to a repository** - a minimal reproduction of the problem',
      '- **Screens version** - the exact version from your `package.json` or lockfile',
      '- **React Native version** - the exact version from your `package.json` or lockfile',
      '- **Platforms** - the platforms you actually see the bug on',
      '',
      'Once the issue is updated we will take another look. Thanks!',
    ].join('\n'),
  },
};

// Mirrors `check-issues-only-created-after` from the old bot.
const IGNORE_ISSUES_CREATED_BEFORE = '2022-01-01';

module.exports = async ({ github, context, core }) => {
  const { label } = context.payload;
  const response = RESPONSES[label?.name];

  if (!response) {
    core.notice(`No response configured for "${label?.name}". Skipping.`);
    return;
  }

  if (context.payload.issue.pull_request) {
    core.notice('Triggered on a pull request. Skipping.');
    return;
  }

  // Act on the label's current membership, not on the event action: runs in the
  // concurrency group are not guaranteed to execute in dispatch order, so a stale
  // `unlabeled` run must not retract a response for a label that was reapplied.
  const { data: issue } = await github.rest.issues.get({
    ...context.repo,
    issue_number: context.payload.issue.number,
  });
  const isLabeled = issue.labels.some((l) => (typeof l === 'string' ? l : l.name) === label.name);

  // Retraction runs before the checks below: those decide whether to nag, not
  // whether to clean up. A response must still be removed when the issue was
  // closed after it was posted.
  if (!isLabeled) {
    const posted = await findResponse({ github, context, issue, marker: response.marker });

    if (!posted) {
      core.notice('No response to retract. Skipping.');
      return;
    }

    await github.rest.issues.deleteComment({ ...context.repo, comment_id: posted.id });
    core.notice(`Retracted "${label.name}" response.`);
    return;
  }

  if (issue.state === 'closed') {
    core.notice('Triggered on a closed issue. Skipping.');
    return;
  }

  if (new Date(issue.created_at) < new Date(IGNORE_ISSUES_CREATED_BEFORE)) {
    core.notice(`Issue predates ${IGNORE_ISSUES_CREATED_BEFORE}. Skipping.`);
    return;
  }

  const existing = await findResponse({ github, context, issue, marker: response.marker });

  if (existing) {
    core.notice('Response already posted. Skipping.');
    return;
  }

  await github.rest.issues.createComment({
    ...context.repo,
    issue_number: issue.number,
    body: `${response.marker}\n${greeting(issue.user.login)}\n\n${response.body}`,
  });

  core.notice(`Posted "${label.name}" response.`);
};

async function findResponse({ github, context, issue, marker }) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo,
    issue_number: issue.number,
    per_page: 100,
  });

  return comments.find((comment) => comment.user.type === 'Bot' && comment.body.includes(marker));
}
