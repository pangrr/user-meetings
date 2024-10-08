import { useState, useEffect } from "react";

export default function useFetch(url) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const resp = await fetch(url);
        const json = await resp.json();
        setData(json);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [url]);

  return { data, error, loading };
}
