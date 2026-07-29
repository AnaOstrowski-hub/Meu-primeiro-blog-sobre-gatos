import { type ReactNode } from 'react'

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    nodes.push(<strong key={`${keyPrefix}-${i}`}>{match[2]}</strong>)
    lastIndex = match.index + match[0].length
    i++
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

export default function Markdown({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  let list: string[] | null = null
  let listKey = 0

  function flushList() {
    if (!list) return
    const items = list.map((item, idx) => (
      <li key={`li-${listKey}-${idx}`}>{renderInline(item, `li-${listKey}-${idx}`)}</li>
    ))
    blocks.push(<ul key={`ul-${listKey}`} className="my-3 list-disc space-y-1 pl-6 text-ink-700">{items}</ul>)
    list = null
    listKey++
  }

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd()
    if (!line.trim()) {
      flushList()
      return
    }
    if (line.startsWith('## ')) {
      flushList()
      blocks.push(<h2 key={`h2-${idx}`} className="mt-8 mb-3 text-2xl font-bold text-ink-900">{renderInline(line.slice(3), `h2-${idx}`)}</h2>)
    } else if (line.startsWith('### ')) {
      flushList()
      blocks.push(<h3 key={`h3-${idx}`} className="mt-6 mb-2 text-xl font-semibold text-ink-900">{renderInline(line.slice(4), `h3-${idx}`)}</h3>)
    } else if (line.startsWith('- ')) {
      if (!list) list = []
      list.push(line.slice(2))
    } else if (/^\d+\.\s/.test(line)) {
      flushList()
      blocks.push(<p key={`ol-${idx}`} className="my-2 pl-6 text-ink-700">{renderInline(line, `p-${idx}`)}</p>)
    } else {
      flushList()
      blocks.push(<p key={`p-${idx}`} className="my-3 leading-relaxed text-ink-700">{renderInline(line, `p-${idx}`)}</p>)
    }
  })
  flushList()

  return <div className="prose-blog">{blocks}</div>
}
