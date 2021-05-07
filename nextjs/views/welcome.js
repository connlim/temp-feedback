import axios from "axios";
import Header from "./header";
import { useState } from "react";
import randomWords from "random-words";
import { API_ENDPOINT } from "../pages/index";

export default function Welcome(props) {
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSubdomainInput = (event) => {
    setInputText(event.target.value);
    // Check if input is a valid subdomain
    if (/^[a-z0-9\-]*$/.test(event.target.value)) {
      setErrorMessage("");
    } else {
      setErrorMessage(
        "Invalid subdomain name. Only lowercase letters, numbers, and hyphens are allowed."
      );
    }
  };

  const createSubdomain = (e) => {
    e.preventDefault();
    if (inputText === "") {
      setErrorMessage("Please enter a name for the feedback page.");
    } else if (inputText === "api" || inputText === "www") {
      setErrorMessage(
        "This name is a reserved word. Please try something else."
      );
    } else if (/^[a-z0-9\-]+$/.test(inputText)) {
      setIsSubmitting(true);
      axios
        .post(API_ENDPOINT + "/CreateSubdomain", {
          subdomain: inputText,
        })
        .then(function (res) {
          if (res.status === 200) {
            window.location.href = `https://${res.data.subdomain}.tempfeedback.com`;
          }
        })
        .catch(function (err) {
          if (err.response.status === 409) {
            setErrorMessage("Subdomain already exists. Try another one?");
          } else {
            console.log(err);
          }
          setIsSubmitting(false);
        });
    }
  };

  const generateSubdomainName = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInputText(randomWords(3).join("-"));
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
                placeholder="your-custom-name"
                value={inputText}
                onChange={updateSubdomainInput}
              />
              <span className="inline-block mt-2 ml-2 text-md md:text-xl">
                .tempfeedback.com
              </span>
            </div>
            {errorMessage && (
              <p className="pt-3 text-red-700">{errorMessage}</p>
            )}
            <input
              className="w-32 px-4 py-2 mt-6 font-semibold text-white bg-indigo-500 rounded-full cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 focus:ring-offset-2"
              type="submit"
              value={isSubmitting ? " Creating..." : "Create"}
            />
            <div className="w-full mt-3">
              <a
                className="text-sm text-indigo-700 cursor-pointer hover:underline"
                onClick={generateSubdomainName}
              >
                Can't think of a name? Generate one automatically.
              </a>
            </div>
          </form>
        </div>
        <div className="max-w-xl mb-10">
          <h2 className="text-2xl">What is Temp Feedback?</h2>
          <p>
            Temp Feedback lets you create a custom page which you can use to
            collect feedback from others. Simply create your own feedback page
            and share it with your friends to have them submit their feedback
            anonymously. All subdomains are automatically deleted after 7 days.
          </p>
        </div>
        <div className="max-w-xl">
          <h2 className="text-2xl">How to use</h2>
          <p className="text-left">
            1. Choose a subdomain name
            <br />
            2. Create your custom feedback page
            <br />
            3. Share the link to collect feedback!
          </p>
        </div>
      </div>
    </>
  );
}
