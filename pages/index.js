import useSWR, { SWRConfig } from "swr";

const fetcher = (url) =>
  fetch(url, {
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Restu-Api-Key": process.env.API_KEY
    })
  }).then((res) => res.json());
const API = "https://rest-api.restu.cz/v1/restaurants/23030";

export async function getServerSideProps() {
  const repoInfo = await fetcher(API);
  console.log(repoInfo);
  return {
    props: {
      fallback: {
        [API]: repoInfo
      }
    }
  };
}

function Repo() {
  const { data, error } = useSWR(API);

  // there should be no `undefined` state
  console.log("Is data ready?", !!data);

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";
  console.log(data);
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Repo />
    </SWRConfig>
  );
}
