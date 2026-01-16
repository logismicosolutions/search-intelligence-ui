
  import { NextResponse } from 'next/server';
  import details from '@/data/intentDetails.json';

  function toMarkdown(intentId: string, brief: any) {
    const lines: string[] = [];
    lines.push(`# Content Brief: ${brief.title}`);
    lines.push('');
    lines.push(`**Intent ID:** ${intentId}`);
    lines.push(`**Template:** ${brief.template}`);
    lines.push(`**Priority Score:** ${brief.priorityScore}`);
    lines.push('');
    lines.push('## Summary');
    lines.push(brief.summary);
    lines.push('');
    lines.push('## Suggested Headings');
    for (const h of (brief.suggestedHeadings ?? [])) lines.push(`- ${h}`);
    lines.push('');
    lines.push('## Rationale');
    lines.push(brief.rationale || '');
    lines.push('');
    return lines.join('
');
  }

  export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const intentId = searchParams.get('intentId') || '';
    // @ts-ignore
    const d = details[intentId];
    const brief = d?.recommendations?.contentBrief;
    const md = brief ? toMarkdown(intentId, brief) : `# Content Brief

No brief for ${intentId}`;

    return new NextResponse(md, {
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'content-disposition': `attachment; filename="${intentId || 'content-brief'}.md"`
      }
    });
  }
