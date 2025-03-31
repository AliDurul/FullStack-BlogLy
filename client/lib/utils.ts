// caching session data
import { auth } from "@/auth";

import { cache } from "react";
export default cache(auth)


// Error handling
export const handleError = (error: unknown) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

// Date formatting
type TDateFn = (date: Date) => string
export const getFullDay: TDateFn = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });  
}

export const formatDate: TDateFn = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

// Query handler
import qs from 'query-string'

type TUrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export function formUrlQuery({ params, key, value }: TUrlQueryParams) {

  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

type TRemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export function removeKeysFromQuery({ params, keysToRemove }: TRemoveUrlQueryParams) {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach(key => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

