import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import cookie from 'js-cookie';
import { connectToDatabase } from '../util/mongodb'
import styles from '../styles/Home.module.css'


export default function Home({ isConnected }) {
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
        <title>Inkwyl Terms of Service</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="theme-color" content="#aba48a" />

        <meta name="description" content="Inkwyl is a social media for writing and sharing stories." />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <meta property="og:url" content="https://inkwyl.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Inkwyl" />
        <meta property="og:description" content="Inkwyl is a social media for writing and sharing stories." />
        <meta property="og:image" content="/social.png" />


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
              <Link href="/tos">TOS&#32;</Link>
      <Link href="https://youtube.com/channel/UCvQgmVqYGXudj-KYtUfjr7A" passHref={true}>YouTube&#32;</Link>
      </div>
        <br />
        <Link href="/privacy-policy">Read our privacy policy here</Link>
        <h1>Terms of Service</h1>
        <p>Rules aren't fun, but they help keep a fun,, safe experience for everyone. These are the rules on which the site will be moderated.</p>
        <h3>Takedown Requests</h3>
        <p>If you would like a story or comment to be taken down, please report it to inkwyl@gmail.com and we will look into it. </p>
        <h3>Rules Regarding Stories</h3>
        <p>1. All stories you write and share must follow the content sharing laws of your country and the United States laws.</p>
        <p>2. Stories with heavy langauge and heavy graphic detail is prohibited. </p>
        <p>3. If you are making a story with characters or events not your own, please check the copyright for them, as they may be taken down if copyright requests are made.</p>
        <p>4. Stories that include product placement or adverts have to be disclosed properly.</p>
        <p>5. Hate speech against any entities is prohibited unless it is for the sake of a joke.</p>
        <p>6. You may port your stories from other sites you may have them up on. Just note that we will take them down if they are not yours. </p>

        <h3>Rules Regarding Comments</h3>
        <p>1. Be respectful.</p>
        <p>2. Swearing is prohibited.</p>
        <p>3. Do not advertise your own stories in the comments unless given permission by the author (e.g. in a contest where the author asks you to finish the story).</p>
        <p>4. Blackmail or threats are strictly forbidden</p>
        <p>5. Do not spam</p>
        <p>Failure to follow these rules will result in a deletion of your account, which will result in a shadowban.</p>
        <h3>Verification</h3>
        <p>Your account will be Verified if you are a well known person on this platform or others, and want to protect your identity. Email <Link href="mailto:inkwyl@gmail.com">inkwyl@gmail.com</Link> to go through the process.</p>
        <h3>Reports</h3>
        <p>If you want to report a user, please e-mail <Link href="mailto:inkwyl@gmail.com">inkwyl@gmail.com</Link>.</p>
        <h2>But above all else, have fun!</h2>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { client } = await connectToDatabase()

  const isConnected = await client.isConnected()

  return {
    props: { isConnected },
  }
}
