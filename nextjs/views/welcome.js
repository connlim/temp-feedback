import axios from "axios";
import Header from "./header";
import { useState, useRef } from "react";

export default function Welcome(props) {
  const [inputText, setInputText] = useState("");
  const [showSubdomainAlreadyExists, setSubdomainAlreadyExists] = useState(
    false
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSubdomainInput = (event) => {
    setInputText(event.target.value);
  };

  const createSubdomain = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    axios
      .post(
        "https://api.tempfeedback.com/CreateSubdomain",
        { subdomain: inputText }
      )
      .then(function (res) {
        if (res.status === 200) {
          window.location.href = `https://${res.data.subdomain}.tempfeedback.com`;
        }
      })
      .catch(function (err) {
        if (err.response.status === 409) {
          setSubdomainAlreadyExists(true);
        } else {
          console.log(err);
        }
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Header title="Temp Feedback"></Header>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
        <h1 className="mb-5 text-5xl">Temp Feedback</h1>
        <h2 className="mb-10 text-md">
          Create a temporary URL to collect feedback!
        </h2>
        <div className="flex flex-col items-center w-full px-6 py-8 m-2 bg-white shadow-md mb-14 xl:w-3/5 rounded-3xl">
          <form onSubmit={createSubdomain}>
            <div className="w-full">
              <input
                className="p-2 text-lg text-center text-gray-700 placeholder-gray-400 bg-white border-b-2 border-gray-400 outline-none appearance-none md:text-3xl md:text-right focus:border-indigo-600"
                placeholder="your-custom-subdomain"
                value={inputText}
                onChange={updateSubdomainInput}
              />
              <span className="inline-block mt-2 ml-2 text-md md:text-xl">
                .tempfeedback.com
              </span>
            </div>
            <input
              className="w-32 px-4 py-2 mt-8 font-semibold text-white bg-indigo-500 rounded-full cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 focus:ring-offset-2"
              type="submit"
              value={isSubmitting ? " Creating..." : "Create"}
            />
          </form>
          {showSubdomainAlreadyExists && (
            <p className="pt-3 text-red-700">
              Subdomain already exists. Try another one?
            </p>
          )}
        </div>
        <div className="max-w-xl">
          <h2 className="text-2xl">What is Temp Feedback?</h2>
          <p>
            Temp Feedback allows you to create a custom subdomain which you can
            use to collect anonymous feedback from others. Simply choose a
            subdomain name, create a feedback page, and share the link! All
            subdomains are automatically deleted after 7 days.
          </p>
        </div>
      </div>
    </>
  );
}
