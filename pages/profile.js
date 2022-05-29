import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Router from 'next/router';
import cookie from 'js-cookie';
import styles from '../styles/Home.module.css'

export default function Home({ stories }) {
  const { data, revalidate } = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return <><h1>Loading...</h1></>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
    Router.push(data.link, undefined, { shallow: true })
  } else {
    Router.push("/login", undefined, { shallow: true })
  }
  return (null)
}