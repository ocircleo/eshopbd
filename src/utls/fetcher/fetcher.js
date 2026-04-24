import { APP_CONFIG } from "@/config/app.config";

const fetcher = async (data) => {
  const { url, fetchOptions } = data;

  const fullUrl = `${APP_CONFIG.apiUrl}${url}`;
  const req = await fetch(fullUrl, {...fetchOptions});
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!req.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await req.json();
    error.status = req.status;
    throw error;
  }
  const res = await req.json();
  if (res?.error) {
    console.log(res);
    const error = new Error(res?.message || "Data Error ");
    // Attach extra info to the error object.
    error.info = res;
    error.status = res.status || 300;
    throw error;
  }
  return res.data;
};

export default fetcher;
