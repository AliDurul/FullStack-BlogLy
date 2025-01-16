// caching session data
import { auth } from "@/auth";
import { cache } from "react";

export default cache(auth)


// Error handling
export const handleError = (error: unknown) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}


