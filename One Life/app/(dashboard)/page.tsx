// import { getAllEmails } from "./mailbox/components/mailAPI";

import Image from "next/image";
import DashboardMain from "./components/DashboardMain";
import TopPageNavigation from "../components/TopPageNavigation";

export const metadata = {
  title: "Client Link Dashboard",
  description: "Client Link Dashboard",
};

export default async function Home() {

  return (
    <>
      <TopPageNavigation />
      <DashboardMain />
    </>
  );
}
