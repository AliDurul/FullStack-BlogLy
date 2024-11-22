import React from 'react'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

const people = [
    {
        name: 'Isac',
        title: 'Regional Paradigm Technician',
        role: 'Admin',
        email: 'janecooper@example.com',
        telephone: '+2600772107515',
        time: '2021-09-10 12:00:00',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
        time: '2021-09-10 12:00:00',

        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        role: 'Admin',
        email: 'janecooper@example.com',
        telephone: '+1-202-555-0170',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=6',
    },
    {
        time: '2021-09-10 12:00:00',

        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        role: 'Admin',
        email: 'janecooper@example.com',
        telephone: '+1-202-555-0170',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
        time: '2021-09-10 12:00:00',

        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        role: 'Admin',
        email: 'janecooper@example.com',
        telephone: '+1-202-555-0170',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    // More people...
]
const Records = async () => {

    return (
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {people.map((person) => (
                <li key={person.email} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                    <div className="flex w-full items-center justify-between space-x-6 p-6">
                        <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                                <h3 className="truncate text-sm font-medium text-gray-900">{person.name}</h3>
                                {/* <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {person.role}
                        </span> */}
                            </div>
                            <p className="mt-1 truncate text-sm text-gray-500">{person.title}</p>
                            <p className="mt-1 truncate text-xs text-gray-500">{person.time}</p>
                        </div>
                        <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src={person.imageUrl} alt="" />
                    </div>

                    <div className="-mt-px ">
                        <div className='bg-gray-200'>
                            <audio controls className='custom-audio'>
                                <source src="/assets/records/floskid.mp3" type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                        <div className='flex divide-x divide-gray-200' >
                            <div className="flex w-0 flex-1">
                                <Link
                                    href={`/mailbox`}
                                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                >
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    Email
                                </Link>
                            </div>
                            <div className="-ml-px flex w-0 flex-1">
                                <Link
                                    href={`/wp`}
                                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                >
                                    <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    Call
                                </Link>
                            </div>
                        </div>

                    </div>

                </li>
            ))}
            {/* <AudioRecorder /> */}
        </ul>
    )
}

export default Records