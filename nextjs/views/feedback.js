import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header";
import { API_ENDPOINT } from "../pages/index";

dayjs.extend(relativeTime);

function FeedbackCard(props) {
  return (
    <div className="flex flex-col p-6 my-2 text-left bg-white border border-gray-300 rounded-lg">
      <div className="self-end text-gray-600">
        {dayjs.unix(props.dateTime).fromNow()}
      </div>
      <div>{props.text}</div>
    </div>
  );
}

export default function Feedback(props) {
  const [additionalFeedback, setAdditionalFeedback] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitting(false);
    setInputText("");
    setAdditionalFeedback([]);
  }, [props.feedback]);

  const updateFeedbackInput = (event) => {
    setInputText(event.target.value);
  };

  const submitFeedback = () => {
    setIsSubmitting(true);
    axios
      .post(API_ENDPOINT + "/AddFeedback", {
        subdomain: props.subdomain,
        feedback: inputText,
      })
      .then(function (res) {
        if (res.status === 200) {
          setAdditionalFeedback([res.data].concat(additionalFeedback));
          setIsSubmitting(false);
          setInputText("");
        }
        //router.replace(router.asPath);
      })
      .catch(function (err) {
        console.log(err);
        setIsSubmitting(false);
      });
  };

  let feedbackCards;
  if (
    (props.hasOwnProperty("feedback") && props.feedback.length > 0) ||
    additionalFeedback.length > 0
  ) {
    feedbackCards = additionalFeedback
      .concat(props.feedback)
      .map((feedback, index) => (
        <FeedbackCard
          key={index}
          dateTime={feedback.dateTime}
          text={feedback.text}
        />
      ));
  } else {
    feedbackCards = <div className="text-center">No feedback found</div>;
  }

  let content;
  if (props.subdomainExists) {
    content = (
      <div className="flex flex-col items-center w-full p-2">
        <div className="flex flex-col items-center w-full px-6 pt-5 pb-8 mb-12 bg-white shadow-md sm:px-12 xl:w-1/2 rounded-2xl">
          <p>Share this link:</p>
          <a
            className="mb-8 text-2xl font-semibold underline hover:text-indigo-700"
            href={`https://${props.subdomain}.tempfeedback.com`}
          >
            {props.subdomain}.tempfeedback.com
          </a>
          <p className="mb-4 text-sm">
            This feedback page will be automatically deleted after{" "}
            <span className="font-bold">
              {dayjs.unix(props.createdAt).add(7, "day").format("MMM D")}
            </span>
            .
          </p>
          <textarea
            className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-400 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            value={inputText}
            rows="6"
            onChange={updateFeedbackInput}
            placeholder="Type your feedback here!"
          />
          <button
            className="w-32 px-4 py-2 mt-8 font-semibold text-white bg-indigo-500 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 focus:ring-offset-2"
            variant="primary"
            type="button"
            onClick={submitFeedback}
          >
            {isSubmitting && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {isSubmitting ? " Sending..." : "Submit"}
          </button>
        </div>
        <div className="w-full md:w-2/3 xl:w-1/3">{feedbackCards}</div>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col items-center w-full">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <p className="text-center">
            No such subdomain found.{" "}
            <a
              className="text-indigo-700 border-b-2 border-transparent hover:border-indigo-700"
              href="https://www.tempfeedback.com"
            >
              Try creating one?
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header title={props.subdomain + " - Temp Feedback"}></Header>
      <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
        <h1 className="p-2 mt-8 text-4xl">
          <a
            className="border-b-4 border-transparent hover:text-indigo-700 hover:border-indigo-700"
            href="https://www.tempfeedback.com"
          >
            Temp Feedback
          </a>
        </h1>
        <h2 className="mb-8 text-sm">Anonymous feedback collection platform</h2>
        {content}
      </div>
    </>
  );
}
