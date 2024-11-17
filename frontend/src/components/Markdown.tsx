import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';

const MarkdownView = () => {
  const [readme, setReadme] = useState('');

  useEffect(() => {
    const readReadme = async () => {
      try {
        const response = await fetch('/readme.md');
        if (response.ok) {
          const text = await response.text();
          setReadme(text);
        } else {
          toast.error('Failed to load readme.md');
        }
      } catch (error) {
        toast.error('Error loading readme.md');
        console.error('Error loading readme:', error);
      }
    };

    readReadme();
  }, []);

  return (
    <div className="h-screen p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Markdown
          remarkPlugins={[
            [remarkGfm],
            [remarkToc, {
              tight: true,
              maxDepth: 5,
              heading: 'contents'
            }]
          ]}
          rehypePlugins={[rehypeSlug]}
          className="markdown max-w-full prose prose-slate"
        >
          {readme}
        </Markdown>
      </div>
    </div>
  );
};

export default MarkdownView;