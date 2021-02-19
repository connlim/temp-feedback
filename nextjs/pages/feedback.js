import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Head from "next/head";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function submitFeedback() {
  alert("Hello world");
}

function FeedbackCard(props) {
  return (
    <Card className="m-2">
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted text-right">
          {dayjs(props.dateTime).fromNow()}
        </Card.Subtitle>
        <Card.Text>{props.text}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default function Feedback() {
  return (
    <>
      <Head>
        <title>Feedback</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="py-4">
        <h1>Ephemeral Feedback</h1>

        <Form className="m-2 w-100">
          <Form.Group controlId="">
            <Form.Label>Example textarea</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <Button variant="primary" type="button" onClick={submitFeedback}>
            Submit
          </Button>
        </Form>

        <Row className="justify-content-center">
          <Col lg={8}>
            <FeedbackCard dateTime="2021-01-01" text="Hello world" />
            <FeedbackCard
              dateTime="2021-02-19T15:43:00+08:00"
              text="Hello world again!"
            />
            <FeedbackCard />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
