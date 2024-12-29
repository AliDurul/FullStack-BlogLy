import { auth } from "@/auth";

const API_BASE_URL = process.env.API_BASE_URL;

export default async function Home() {

  const session = await auth()

  return (
    <h1> {session?.user.fullname}</h1>
  );
}
