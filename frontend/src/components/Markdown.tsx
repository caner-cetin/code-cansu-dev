import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'

export default function MarkdownView() {
  const [readme, setReadme] = useState('')

  useEffect(() => {
    const readReadme = async () => {
      const response = await fetch('/readme.md')
      if (response.ok) {
        const text = await response.text()
        setReadme(text)
      } else {
        toast.error('dumbass me forgot writing readme.md, sorry')
      }
    }
    readReadme()
  }, [])

  return (
    <div className="h-screen p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Markdown
          remarkPlugins={[
            [remarkGfm, { singleTilde: false }],
            [
              remarkToc,
              { tight: true, maxDepth: 5, heading: 'contents' },
            ],
          ]}
          rehypePlugins={[[rehypeSlug]]}
          className="markdown max-w-full prose prose-slate"
        >
          {readme}
        </Markdown>
      </div>
    </div>
  )
}