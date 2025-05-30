import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeFormat from 'rehype-format';
import { htmlToText } from 'html-to-text';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}




export function formatLastUpdated(date: Date | string | number): string {
  const parsedDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}


export async function markdownToReadableText(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(markdown);

  const html = String(file);

  const plainText = htmlToText(html, {
    wordwrap: 120,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' }
    ],
    preserveNewlines: true,
  });

  return plainText.trim();
}