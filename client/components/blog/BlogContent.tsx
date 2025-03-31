import Image from 'next/image';
import React from 'react'

const Img = ({ url, caption }: any) => {
    return (
        <div>
            <Image src={url} alt={caption} width={200} height={200} />
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
}


export default function BlogContent({ block }: { block: any }) {
    const { type, data } = block;

    if (type === 'paragraph') {
        return <p dangerouslySetInnerHTML={{ __html: data.text }} />
    }

    if (type === 'header') {
        if (data.level === 3) return <h3 className='text-3xl font-bold' dangerouslySetInnerHTML={{ __html: data.text }} />
        else if (data.level === 2) return <h2 className='text-4xl font-bold' dangerouslySetInnerHTML={{ __html: data.text }} />

    }

    if (type === 'image') return <Img url={data.file.url} caption={data.caption} />

    if (type === 'quote') return <Quote quoto={data.text} caption={data.caption} />

    if (type === 'list') return <List style={data.style} items={data.items} />


}
