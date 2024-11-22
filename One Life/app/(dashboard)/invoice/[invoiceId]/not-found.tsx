import { headers } from 'next/headers'
import React from 'react'

export default async function NotFound() {

  const headersList = headers()
  const domain = headersList.get('host')
  return (
    <h1>Invoice not fouind</h1>
  )
}
