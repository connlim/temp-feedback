import axios from "axios";
import Header from "./header";
import { useState, useRef } from "react";

export default function Welcome(props) {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSubdomainInput = (event) => {
    setInputText(event.target.value);
  };

  const createSubdomain = () => {
    setIsSubmitting(true);
    axios
      .post(
        "https://07ncbm8zzg.execute-api.us-east-2.amazonaws.com/CreateSubdomain",
        { subdomain: inputText }
      )
      .then(function (res) {
        if (res.status === 200) {
          window.location.href = `http://${res.data.subdomain}.localhost:3000`;
        }
      })
      .catch(function (err) {
        console.log(err);
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Header title="Ephemeral Feedback"></Header>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
        <h1 className="mb-5 text-5xl">Ephemeral Feedback</h1>
        <h2 className="mb-10 text-md">
          Create a temporary URL to collect feedback!
        </h2>
        <div className="flex flex-col items-center w-full px-6 py-8 m-2 bg-white shadow-md mb-14 xl:w-3/5 rounded-3xl">
          <div className="w-full">
            <input
              className="p-2 text-lg text-center text-gray-700 placeholder-gray-400 bg-white border-b-2 border-gray-400 outline-none appearance-none md:text-3xl md:text-right focus:border-indigo-600"
              placeholder="Your Custom Subdomain"
              value={inputText}
              onChange={updateSubdomainInput}
            />
            <span className="inline-block mt-2 ml-2 text-md md:text-xl">.ephemeralfeedback.com</span>
          </div>
          <button
            className="w-32 px-4 py-2 mt-8 font-semibold text-white bg-indigo-500 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 focus:ring-offset-2"
            type="button"
            onClick={createSubdomain}
          >
            {isSubmitting && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {isSubmitting ? " Creating..." : "Create"}
          </button>
        </div>
        <div className="max-w-xl">
          <h2 className="text-2xl">What is Ephemeral Feedback?</h2>
          <p>
            Sapiente tenetur consequatur aspernatur. Quia consequatur
            consectetur perspiciatis qui. Quod autem officia numquam officiis
            dolor. Voluptatibus velit quam asperiores corrupti ut voluptatem
            consectetur ut. Fugiat maiores eius dolore ab fugit consequatur
            assumenda aut. Dolorem quia vel tempora accusantium aut.
          </p>
        </div>
      </div>
    </>
  );
}
