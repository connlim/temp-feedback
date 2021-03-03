import axios from "axios";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import styles from "../styles/Home.module.css";

export default function Welcome(props) {
  const createSubdomain = (event) => {
    // axios.post("");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="d-flex flex-column flex-grow-1 justify-content-center align-items-center py-5">
        <h1 className={styles.title}>Ephemeral Feedback</h1>

        <div className={styles.card}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="your subdomain name"
              aria-label="your subdomain name"
              aria-describedby="basic-addon"
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon">
                .ephemeralfeedback.com
              </InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Button variant="primary">Create</Button>
        </div>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </Container>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
