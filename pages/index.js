import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import cookie from 'js-cookie';
import { connectToDatabase } from '../util/mongodb'

export default function Home({ stories, users, comments }) {
    const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return <><h1>Loading...</h1><title>Inkwyl</title><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /><link rel="manifest" href="/site.webmanifest" /><link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" /><meta name="msapplication-TileColor" content="#ffc40d" /><meta name="theme-color" content="#aba48a" /> <meta name="description" content="Inkwyl is a social media for writing and sharing stories." /> <meta property="og:url" content="https://inkwyl.vercel.app/" /><meta property="og:type" content="website" /><meta property="og:title" content="Inkwyl" /><meta property="og:description" content="Inkwyl is a social media for writing and sharing stories." /><meta property="og:image" content="/social.png" /> <meta name="twitter:card" content="summary_large_image" /><meta property="twitter:domain" content="inkwyl.vercel.app" /><meta property="twitter:url" content="https://inkwyl.vercel.app/" /><meta name="twitter:title" content="Inkwyl" /><meta name="twitter:description" content="Inkwyl is a social media for writing and sharing stories." /><meta name="twitter:image" content="/social.png" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
  return (
       <div className="container">
      <Head>
        <title>Inkwyl</title>
<link rel="icon" href="favicon.ico" type="image/x-icon" />
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
     <Link href="/">
     Home&nbsp;&#32;
     </Link>
     <Link href="/editor">
     Editor&nbsp;&#32;
     </Link>
      <Link href="/about">
     About&nbsp;&#32;
     </Link>
     <Link href="/users">
     Users&nbsp;&#32;
     </Link>
             
                {loggedIn && (
        <>
        <Link href={data.link}>Profile&#32;</Link>
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
      {loggedIn && (
        <>
          <div className="statement">
          <h1>Welcome {data.username}!</h1>
<h2>We have {stories.length} stories, {comments.length} comments, and {users.length} users.</h2>     
<Link href="/editor">Write a story</Link> or read some here.
           </div>
        </>
      )}
      {!loggedIn && (
        <>
        <h1>Welcome!</h1>
        <h2>We have {stories.length} stories, {comments.length} comments, and {users.length} users.</h2>
        <p>Consider logging in or signing up</p>
        </>
      )}
       <div>
           {stories.map((story) => (
            <h3><Link shallow href={story.storyLink}>{story.title}</Link> by <Link shallow href={story.userlink}>{story.username}</Link></h3>
        ))}
       </div>
     </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();
  const stories = await db
    .collection("stories")
    .find({},{projection:{story:0}})
    .toArray();
  const comments = await db
    .collection("comments")
    .find({}, { projection: { comment: 0 }})
    .toArray();
    const users = await db
    .collection("users")
    .find({}, { projection: { email: 0, password: 0 } })
    .toArray();
   
  return {
    props: {
      stories: JSON.parse(JSON.stringify(stories)).reverse(),
      users: JSON.parse(JSON.stringify(users)),
      comments: JSON.parse(JSON.stringify(comments)),
    },
  };
}
