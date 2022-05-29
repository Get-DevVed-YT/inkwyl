import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

function Error({ statusCode }) {
  return (
      <div className="container">
      <Head>
        <title>Inkwyl Error</title>
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
     <div>
          <p>
          <h1>Whoops!</h1>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
    <Link shallow href="/">Back to home</Link>
     </div>
    </div>
  </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
