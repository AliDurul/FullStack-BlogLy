import React, { Suspense } from 'react'
import TicketStats from './components/TicketStats'
import TopPageNavigation from '@/app/components/TopPageNavigation'

export const metadata = { title: 'Tickets' }

import dynamic from 'next/dynamic';

const TicketTable = dynamic(() => import('./components/TicketTable'), { ssr: false, loading: () => <p>Loading...</p> }
);

export default async function TicketListPage() {


  // const session = await auth();
  // const accessToken = session?.accessToken;

  return (
    <>
      <TopPageNavigation />

      <TicketStats />

      <TicketTable />

    </>
  )
}
