import { auth } from "@/auth";
import { cache } from "react";


export const handleError = (error: unknown) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

export default cache(auth)
