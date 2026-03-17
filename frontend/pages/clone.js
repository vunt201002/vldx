import Head from 'next/head';
import Section1 from '../components/clone/Section1';
import Section2 from '../components/clone/Section2';
import Section3 from '../components/clone/Section3';
import Section4 from '../components/clone/Section4';
import Section5 from '../components/clone/Section5';
import Section6 from '../components/clone/Section6';

export default function ClonePage() {
  return (
    <>
      <Head>
        <title>concrete collaborative</title>
        <meta name="description" content="modern concrete + terrazzo architectural finishes" />
      </Head>
      <main>
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Section6 />
      </main>
    </>
  );
}
