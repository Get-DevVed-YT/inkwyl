import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import cookie from 'js-cookie';


export default function Home() {
  const { data, revalidate } = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
  return (
    <div className="container">
      <Head>
        <title>About Inkwyl</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="theme-color" content="#aba48a" />

        <meta name="description" content="Inkwyl is a social media for writing and sharing stories." />

        <meta property="og:url" content="https://inkwyl.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Inkwyl" />
        <meta property="og:description" content="Inkwyl is a social media for writing and sharing stories." />
        <meta property="og:image" content="/social.png" />

        <link rel="icon" href="favicon.ico" type="image/x-icon" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="inkwyl.vercel.app" />
        <meta property="twitter:url" content="https://inkwyl.vercel.app/" />
        <meta name="twitter:title" content="Inkwyl" />
        <meta name="twitter:description" content="Inkwyl is a social media for writing and sharing stories." />
        <meta name="twitter:image" content="/social.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      </Head>
      <div className="logoContainer">
        <Link href="/">
         <Image src="/logo.svg" layout="fill" objectPosition="top"
          className="logo" />
          </Link>
     </div>
           <div className="navbar">
        <Link href="/" shallow>
          Home&nbsp;&#32;
     </Link>
        <Link href="/editor">
          Editor&nbsp;&#32;
     </Link>
        <Link href="/about">
          About&nbsp;&#32;
     </Link>
        <Link href="/users" shallow>
          Users&nbsp;&#32;
     </Link>

        {loggedIn && (
          <>
            <Link shallow href={data.link}>Profile&#32;</Link>
            <a href="/"
              onClick={() => {
                cookie.remove('token');
                revalidate();
              }}>
              Logout&nbsp;&#32;
          </a>
          </>
        )}
        {!loggedIn && (
          <>
            <Link href="/login">Login&#32;</Link>
            <Link href="/signup">Signup&#32;</Link>
          </>
        )}
        <Link href="/tos">TOS</Link>
      </div>
      <div class="mcontent">
        <div className="logoContainer">
          <Link shallow href="/">
            <Image src="/writing.svg" layout="fill" objectPosition="top"
              className="logo" />
          </Link>
        </div>
        <h1>About Inkwyl</h1>
        <p>Inkwyl is a social network made in the interest of authors looking to write and share their stories with the general public. It is also made for readers who want to read new stories from new authors. Whether reader or writer, and no matter what genre you are in to, Inkwyl has something for everyone.</p>
        <p>Inkwyl is created by Ved Rane, and is made possible because of your support.</p>
      </div>
    </div>
  )
}
