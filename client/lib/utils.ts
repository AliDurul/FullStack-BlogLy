// caching session data
import { auth } from "@/auth";
import { TRemoveUrlQueryParams, TUrlQueryParams } from "@/types";
import { cache } from "react";
export default cache(auth)


// Error handling
export const handleError = (error: unknown) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

// Formating Date
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Fridat', 'Saturday']

export const formatDate = (date: Date) => {
  const d = new Date(date)
  return `${d.getDate()} ${months[d.getMonth()]}`
};

export const getFullDay = (date: Date) => {
  const d = new Date(date)
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

// Query handler
import qs from 'query-string'

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

