import useSWR from "swr";
import fetcher from "./fetcher";

function useFetcher(url, fetchOptions = {}, options = {}) {
  const { data, error, isLoading,isValidating, mutate } = useSWR({url,fetchOptions}, fetcher, options);
  
  return {
    data,
    isLoading,
    isValidating,
    error,
    mutate: mutate,
  };
}
export default useFetcher;
