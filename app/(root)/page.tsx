import { auth } from "@/auth";
import getSession from "@/lib/utils";
const API_BASE_URL = process.env.API_BASE_URL;

export default async function Home() {

  const session = await getSession()

  const res = await fetch('http://localhost:8000/users', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const users = await res.json()
  // console.log(users);

  return (
    <h1> {session ? 'logged in' : 'not logged in'}</h1>

  );
}
