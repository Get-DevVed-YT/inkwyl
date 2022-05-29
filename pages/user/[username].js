import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import cookie from 'js-cookie';
import { connectToDatabase } from '/util/mongodb'
import styles from '/styles/Home.module.css'



export default function Home({prof, stories, comments, title}) {
    const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return (
    <><h1>Loading...</h1><link rel="icon" href="favicon.ico" type="image/x-icon" /><title>{title}</title><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /><link rel="manifest" href="/site.webmanifest" /><link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" /><meta name="msapplication-TileColor" content="#ffc40d" /><meta name="theme-color" content="#aba48a" /><meta name="description" content={prof.bio} /><meta property="og:url" content="https://inkwyl.vercel.app/" /><meta property="og:type" content="website" /><meta property="og:title" content={title} /><meta property="og:description" content={prof.bio} /><meta property="og:image" content="/social.png" /><meta name="twitter:card" content="summary_large_image" /><meta property="twitter:domain" content="inkwyl.vercel.app" /><meta property="twitter:url" content="https://inkwyl.vercel.app/" /><meta name="twitter:title" content={title} /><meta name="twitter:description" content={prof.bio} /><meta name="twitter:image" content="/social.png" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></> 
  );
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
  return (
       <div className="container">
      <Head>
      <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <title>{title}</title>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="manifest" href="/site.webmanifest" />
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
<meta name="msapplication-TileColor" content="#ffc40d" />
<meta name="theme-color" content="#aba48a" />

<meta name="description" content={prof.bio} />

<meta property="og:url" content="https://inkwyl.vercel.app/" />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={prof.bio} />
<meta property="og:image" content="/social.png" />


<meta name="twitter:card" content="summary_large_image" />
<meta property="twitter:domain" content="inkwyl.vercel.app" />
<meta property="twitter:url" content="https://inkwyl.vercel.app/" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={prof.bio} />
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
        {!prof.username && (
         <>
          <h1>User not found :/</h1>
         </>
        )}
       {prof.username && (
      <>
       <h1>@{prof.username}</h1>
         {prof.verified && (
       <>
        <span className="verified">Verified User</span>
       </>
       )}
       <h3><b>{Object.keys(stories).length} stories, {Object.keys(comments).length} comments</b></h3>
       <p>{prof.bio}</p>
             <h2>Stories</h2>
      {stories.map((story) => (
            <h3><Link shallow href={story.storyLink}>{story.title}</Link></h3>
        ))}
        <h2>Recent Comments</h2>
     {comments.map((comment) => (
     <>
     <div className="comment">
        <p>{comment.comment}</p>
          <b><Link shallow href={comment.storyLink}>Go to story</Link></b>
      </div><br/>
     </>
        ))}
       </>
        )}
     </div>
    </div>
  )
}



export async function getServerSideProps(context) {
  const { username } = context.query
  
  var link = process.env.BASE_URL+'api/getuser/' + username;
  console.log(link)
  const res = await fetch(link)
  const prof = await res.json()
   
  if (!prof) {
    return {
      notFound: true,
    }
  }

  const userlink = prof.userlink;
  console.log(userlink)
  const { db } = await connectToDatabase();
  const stories = await db
    .collection("stories")
    .find({userlink},{projection:{story:0}})
    .toArray();
  const comments = await db
    .collection("comments")
    .find({userlink})
    .toArray();
  
  console.log(prof.verified)
  const title = "@" + prof.username + " on Inkwyl";

  return {
    props: { prof, 
    title,
    stories: JSON.parse(JSON.stringify(stories)).reverse(),
    comments: JSON.parse(JSON.stringify(comments)).reverse() }, 
  }
}
