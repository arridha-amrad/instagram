import { auth } from "@/auth";

const Page = async () => {
  const session = await auth();
  return <section>{JSON.stringify(session)}</section>;
};

export default Page;
