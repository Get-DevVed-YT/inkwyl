import Head from 'next/head';
import Image from 'next/image';
import fetch from 'isomorphic-unfetch';
import Router from 'next/router';
import useSWR from 'swr';
import cookie from 'js-cookie';
import Link from 'next/link';
import React, { useState, Component } from 'react';
import dynamic from 'next/dynamic';
import { render } from 'react-dom';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
	ssr: false,
	loading: () => <p>Loading ...</p>
});

const modules = {
	toolbar: [
		[{ header: '1' }, { header: '2' }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' }
		],
		['clean']
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false
	}
};
const formats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent'
];

const Editor = () => {
	const [error, setError] = useState('');
	const [title, setTitle] = useState('');
	const [story, setStory] = useState('');
	const { data, revalidate } = useSWR('/api/me', async function(args) {
		const res = await fetch(args);
		return res.json();
	});
	if (!data) return <h1>Loading...</h1>;
	let loggedIn = false;
	if (data.email) {
		loggedIn = true;
	}
	const username = data.username;
	var userlink = data.link;
	function handleSubmit(e) {
		e.preventDefault();
		if (story.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
			setError('Stories cannot be blank.');
			return;
		} else {
			fetch('/api/story', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
                                        
				},
				body: JSON.stringify({
					username,
					userlink,
					title,
					story
				})
			})
				.then(r => r.json())
				.then(data => {
					if (data && data.succeeded) {
						console.log(data.succeeded);
						Router.push('/', undefined, { shallow : false });
					} else {
						setError('Story create failed');
					}
				});
		}
	}
	return (
		<div className="container">
			<Head>
				<title>Inkwyl Story Editor</title>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
                                <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css" />
				<link rel="icon" href="favicon.ico" type="image/x-icon" />
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
				<meta name="msapplication-TileColor" content="#ffc40d" />
				<meta name="theme-color" content="#aba48a" />

				<meta
					name="description"
					content="Inkwyl is a social media for writing and sharing stories."
				/>

				<meta property="og:url" content="https://inkwyl.vercel.app/" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Inkwyl" />
				<meta
					property="og:description"
					content="Inkwyl is a social media for writing and sharing stories."
				/>
				<meta property="og:image" content="/social.png" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:domain" content="inkwyl.vercel.app" />
				<meta property="twitter:url" content="https://inkwyl.vercel.app/" />
				<meta name="twitter:title" content="Inkwyl" />
				<meta
					name="twitter:description"
					content="Inkwyl is a social media for writing and sharing stories."
				/>
				<meta name="twitter:image" content="/social.png" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className="logoContainer">
<Link href="/"><Image src="/logo.svg" layout="fill" objectPosition="top" className="logo" /></Link>
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
     </div> 
			<div class="mcontent">
				<br />
				<form onSubmit={handleSubmit}>
					<label for="title">Title: </label>
					<input
						required
						type="text"
						id="title"
						name="title"
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<QuillNoSSRWrapper
						value={story}
						onChange={setStory}
						modules={modules}
						formats={formats}
     						placeholder="Write a story!"
                                                class="editor"
                                                theme="snow"
					/>
					{loggedIn && (
						<>
							<input type="submit" name="submit" />
							{error && <p style={{ color: 'red' }}>{error}</p>}
						</>
					)}
					{!loggedIn && (
						<>
							<p>Sign in to share</p>
						</>
					)}
				</form>
			</div>
		</div>
	);
};

export default Editor;
