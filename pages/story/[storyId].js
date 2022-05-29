import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import cookie from 'js-cookie';
import styles from '/styles/Home.module.css'
import { connectToDatabase } from '/util/mongodb'
import 'react-quill/dist/quill.snow.css'
import sanitizeHtml from 'sanitize-html';
import React, {useState, Component} from 'react';
import dynamic from 'next/dynamic'
import { render } from 'react-dom'
import Router from 'next/router'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const modules = {
  toolbar: false
}


export default function Home({story, comments, title, desc}) {
  const [comment, setComment] = useState('');
    const clearState = () => {
        setComment('')
    }
    const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return (
    <><h1>Loading...</h1><link rel="icon" href="favicon.ico" type="image/x-icon" /><title>{title}</title><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /><link rel="manifest" href="/site.webmanifest" /><link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" /><meta name="msapplication-TileColor" content="#ffc40d" /><meta name="theme-color" content="#aba48a" /><meta name="description" content={desc} /><meta property="og:url" content="https://inkwyl.vercel.app/" /><meta property="og:type" content="website" /><meta property="og:title" content={title} /><meta property="og:description" content={desc} /><meta property="og:image" content="/social.png" /><meta name="twitter:card" content="summary_large_image" /><meta property="twitter:domain" content="inkwyl.vercel.app" /><meta property="twitter:url" content="https://inkwyl.vercel.app/" /><meta name="twitter:title" content={title} /><meta name="twitter:description" content={desc} /><meta name="twitter:image" content="/social.png" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></> 
  );
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
  const username = data.username;
  var userlink = data.link;
  var sanStory = sanitizeHtml(story.story);
  var storyLink = story.storyLink
    function handleSubmit(e) {
    e.preventDefault();
 if (comment.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
		return;
} else {
    fetch('/api/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        userlink,
        storyLink,
        comment
      }),
     }).then((r) => r.json()).then((data) => {
      if(data && data.succeeded){
        Router.push(storyLink)
        clearState()
      }
    });
}
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

<meta name="description" content={desc} />

<meta property="og:url" content="https://inkwyl.vercel.app/" />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={desc} />
<meta property="og:image" content="/social.png" />


<meta name="twitter:card" content="summary_large_image" />
<meta property="twitter:domain" content="inkwyl.vercel.app" />
<meta property="twitter:url" content="https://inkwyl.vercel.app/" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={desc} />
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
        {!sanStory && (
         <>
          <h1>Story not found :/</h1>
         </>
        )}
       {sanStory && (
      <>
       <h1>{story.title}</h1>
       <h4>by <Link shallow href={story.userlink}>{story.username}</Link></h4>
        <QuillNoSSRWrapper value={sanStory} modules={modules} readOnly="true" theme="snow" />
                              {loggedIn && (
                 
        <>
         <form onSubmit={handleSubmit}>
         <label for="comment">Comment</label><br/>
           <textarea name="comment" id="comment" value={comment}
          onChange={(e) => setComment(e.target.value)}></textarea>
          <br/> <input type="submit" value="Submit" />
         </form>
        </>
      )}
      {!loggedIn && (
        <>
        Login or sign up to comment.
        </>
      )}
            <div>
      <h2>Comments</h2>
        {comments.map((comment) => (
        <>
        <div className="comment">
            <Link shallow href={comment.userlink}><h3>@{comment.username}</h3></Link><p>{comment.comment}</p>
          </div>
            </>
        ))}
      </div>
      
       </>
        )}
      
     </div>
    </div>
  )
}



export async function getServerSideProps(context) {
  const { storyId } = context.query
  
  var link = process.env.BASE_URL+'api/getstory/' + storyId;
  console.log(link)
  const res = await fetch(link)
  const story = await res.json()
   
  if (!story) {
    return {
      notFound: true,
    }
  }

  const storyLink = story.storyLink;
  console.log(storyLink)
  
  const { db } = await connectToDatabase();
  
  const comments = await db
    .collection("comments")
    .find({storyLink})
    .toArray();

   console.log(comments)
   const title = story.title + " by @" + story.username + " on Inkwyl";
   var desc = story.story;
   desc = desc.replace( /(<([^>]+)>)/ig, '');
   if (desc.length <= 50) {
     desc = desc;
   } else {
     desc = desc.substring(0, 50) + "...";
   }
  return {
    props: { story, 
        desc,
        title,
        comments: JSON.parse(JSON.stringify(comments)).reverse()}, // will be passed to the page component as props
  }
}
