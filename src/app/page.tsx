import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import Head from "next/head";
import { Header } from "~/components/Header";

export default async function Home() {
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <Head>
        <title>NoteTaker</title>
        <meta name="description" content="NoteTaker" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Header sessionData={session} />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Note<span className="text-[hsl(280,100%,70%)]">T</span>aker
          </h1>
        </div>
      </main>
    </HydrateClient>
  );
}
