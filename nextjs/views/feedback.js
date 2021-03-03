import axios from "axios";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Head from "next/head";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";

dayjs.extend(relativeTime);

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

export default function Feedback(props) {
  const [inputText, setInputText] = useState("");

  const updateFeedbackInput = (event) => {
    setInputText(event.target.value);
  };

  const submitFeedback = (event) => {
    alert(inputText);
  };

  let feedbackCards;
  if (props.hasOwnProperty("feedback") && props.feedback.length > 0) {
    feedbackCards = props.feedback.map((feedback, index) => (
      <FeedbackCard
        key={index}
        dateTime={feedback.dateTime}
        text={feedback.text}
      />
    ));
  } else {
    feedbackCards = <div>No feedback found</div>;
  }

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
            <Form.Control
              as="textarea"
              rows={3}
              value={inputText}
              onChange={updateFeedbackInput}
              placeholder="Enter your feedback!"
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={submitFeedback}>
            Submit
          </Button>
        </Form>

        <Row className="justify-content-center">
          <Col lg={8}>{feedbackCards}</Col>
        </Row>
      </Container>
    </>
  );
}
