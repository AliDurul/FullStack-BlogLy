import Image from 'next/image';
import CodeBlock from './CodeBlock';

const Img = ({ url, caption }: any) => {
    return (
        <div className="w-full aspect-video relative rounded-lg overflow-hidden flex flex-col items-center">
            <Image
                src={url}
                alt={caption}
                fill
                className="object-contain w-full h-full"
                sizes="(max-width: 900px) 100vw, 900px"
            />
            {caption && <p className='w-full text-center my-3 md:mb-12 text-base text-dark-grey'>{caption}</p>}
        </div>
    )
}

const Quote = ({ quoto, caption }: any) => {
    return (
        <div className='bg-purple/10 p-3 pl-5 border-l-4 border-purple'>
            <p className='text-xl leading-10 md:text-2xl'>{quoto}</p>
            {caption && <p className='w-full text-base text-purple'>{caption}</p>}
        </div>
    )
}

const List = ({ style, items }: any) => {
    return (
        <ol className={`pl-5 ${style === 'ordered' ? 'list-decimal' : 'list-disc'} `}>
            {items.map((item: any, i: number) => <li key={i} className='my-4' dangerouslySetInnerHTML={{ __html: item.content }} />)}
        </ol>
    )
};

const Checklist = ({ items }: any) => {
    return (
        <ul className="pl-5 list-none">
            {items.map((item: any, i: number) => {
                // Support both item.checked and item.meta?.checked for compatibility
                const checked = typeof item.checked === 'boolean' ? item.checked : item.meta?.checked;
                return (
                    <li key={i} className="flex items-center gap-2 my-2">
                        <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            className="accent-purple-600 w-5 h-5 cursor-pointer"
                            aria-checked={checked}
                        />
                        <span
                            className={checked ? "line-through text-gray-400" : ""}
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    </li>
                );
            })}
        </ul>
    )
}


export default function BlogContent({ block }: { block: any }) {
    const { type, data } = block;

    if (type === 'paragraph') {
        const html = data.text.replace(/<code class=\"inline-code\">([\s\S]*?)<\/code>/g, (match: string, p1: string) => {
            return `<code style="background:#e5e7eb;color:#9333ea;padding:2px 4px;border-radius:4px;">${p1}</code>`;
        });
        return <p dangerouslySetInnerHTML={{ __html: html }} />
    }

    if (type === 'header') {
        if (data.level === 3) return <h3 className='text-3xl font-bold' dangerouslySetInnerHTML={{ __html: data.text }} />
        else if (data.level === 2) return <h2 className='text-4xl font-bold' dangerouslySetInnerHTML={{ __html: data.text }} />
    }

    if (type === 'image') return <Img url={data.file.url} caption={data.caption} />

    if (type === 'quote') return <Quote quoto={data.text} caption={data.caption} />

    if (type === 'list' && data.style === 'checklist') return <Checklist items={data.items} />

    if (type === 'list') return <List style={data.style} items={data.items} />

    if (type === 'code') return <CodeBlock code={data.code} />

    return <p className='text-red-500'>Unsupported block type</p>

}
