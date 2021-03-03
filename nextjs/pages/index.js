import Feedback from "../views/feedback";
import Welcome from "../views/welcome";
import dayjs from "dayjs";

export default function Index(props) {
  if (props.subdomain === "www") {
    return <Welcome />;
  } else {
    return <Feedback feedback={props.feedback} />;
  }
}

export async function getServerSideProps(context) {
  const subdomain = context.req.headers.host.split(".")[0];
  console.log(subdomain);
  let feedback;

  if (subdomain === "www") {
    feedback = null;
  } else {
    // const res = await axios.get("");

    // if ("feedback" in res.data) {
    //   return {
    //     props: {feedback: data.feedback}
    //   }
    // } else {
    //   return {
    //     props: { },
    //   };
    // }
    feedback = [
      {
        dateTime: "2021-02-19T15:43:00Z",
        text: "The quick brown fox jumps over the lazy dog",
      },
      {
        dateTime: "2021-02-22T15:43:00Z",
        text: "The quick brown fox jumps over the lazy dog 2",
      },
      {
        dateTime: "2021-02-23T15:43:00Z",
        text: "The quick brown fox jumps over the lazy dog 3",
      },
    ];
    feedback.sort((a, b) => {
      const x = dayjs(a);
      const y = dayjs(b);
      if (x.isBefore(y)) {
        return 1;
      } else if (x.isSame(y)) {
        return 0;
      } else {
        return -1;
      }
    });
  }

  return {
    props: {
      subdomain,
      feedback,
    },
  };
}
