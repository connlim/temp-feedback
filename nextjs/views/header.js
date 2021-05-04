import Head from "next/head";

export default function Header(props) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content="Temp Feedback lets you create a custom page which you can use to collect feedback from others. People can simply visit your feedback page on their device to submit their feedback anonymously. To protect your privacy, all subdomains are automatically deleted after 7 days."
      />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
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
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
}
