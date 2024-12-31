import { auth } from "@/auth";
import getSession from "@/lib/utils";
const API_BASE_URL = process.env.API_BASE_URL;

export default async function Home() {

  const session = await getSession()

  return (
    <h1> {session ? 'logged in' : 'not logged in'}</h1>

  );
}
