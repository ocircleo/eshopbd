import useSWR from "swr";

const internalFetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

function useInternalFetcher(url, options = {}) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(url, internalFetcher, options);

  return {
    data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}

export default useInternalFetcher;