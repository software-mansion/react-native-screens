export async function postToSlack({ text }: { text: string }): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.log('SLACK_WEBHOOK_URL is not set, so nothing is posted to Slack');
    return;
  }
  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Slack webhook error ${res.status}: ${t.slice(0, 400)}`);
  }
}
