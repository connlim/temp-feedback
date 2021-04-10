import Feedback from "../views/feedback";
import Welcome from "../views/welcome";
import dayjs from "dayjs";
import axios from "axios";

export default function Index(props) {
  if (props.subdomain === "www") {
    return <Welcome />;
  } else {
    return (
      <Feedback
        subdomain={props.subdomain}
        subdomainExists={props.subdomainExists}
        feedback={props.feedback}
        createdAt={props.createdAt}
      />
    );
  }
}

export async function getServerSideProps(context) {
  const subdomain = context.req.headers.host.split(".")[0];

  if (subdomain === "www") {
    return {
      props: {
        subdomain,
        subdomainExists: true,
      },
    };
  } else {
    try {
      const res = await axios.get(
        "https://07ncbm8zzg.execute-api.us-east-2.amazonaws.com/GetFeedbackFromSubdomain",
        { params: { subdomain: subdomain } }
      );
      let feedback;
      if ("feedback" in res.data) {
        feedback = res.data.feedback;
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
      } else {
        feedback = [];
      }
      return {
        props: {
          subdomain,
          feedback,
          createdAt: res.data.createdAt,
          subdomainExists: true,
        },
      };
    } catch (err) {
      return {
        props: {
          subdomain,
          feedback: [],
          createdAt: 0,
          subdomainExists: false,
        },
      };
    }
    //feedback = [
    //{
    //dateTime: "2021-02-19T15:43:00Z",
    //text: "The quick brown fox jumps over the lazy dog",
    //},
    //{
    //dateTime: "2021-02-22T15:43:00Z",
    //text: "The quick brown fox jumps over the lazy dog 2",
    //},
    //{
    //dateTime: "2021-02-23T15:43:00Z",
    //text: "The quick brown fox jumps over the lazy dog 3",
    //},
    //];
  }
}
