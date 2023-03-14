import Head from "next/head";
import Input from "../components/Input";
import Display from "../components/Display";

export default function Home() {
  return (
    <>
      <Head>
        <title>rebuild jotai with nextjs and tests</title>
      </Head>
      <h1>rebuild jotai with nextjs and tests</h1>
      <div>
        <Input />
        <Display />
      </div>
    </>
  );
}
