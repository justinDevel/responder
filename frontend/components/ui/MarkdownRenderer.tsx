import ReactMarkdown from 'react-markdown';

type Props = {
  markdown: string;
};

export default function MarkdownRenderer({ markdown }: Props) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
