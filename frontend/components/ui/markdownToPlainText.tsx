import removeMarkdown from 'remove-markdown';

export function markdownToPlainText(markdown: string): string {
  return removeMarkdown(markdown || '');
}