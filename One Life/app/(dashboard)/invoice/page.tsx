import React from 'react'
import InvoiceTable from './components/InvoiceTable'
import TopPageNavigation from '@/app/components/TopPageNavigation'


export const metadata = { title: 'Invoices' }

export default async function InvoiceListPage() {


  return (
    <>
      <TopPageNavigation />

      <InvoiceTable  />
    </>
  )
}
