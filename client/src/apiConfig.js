const isProd = process.env.NODE_ENV === "production";

export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (isProd ? "/api" : "http://localhost:8000/api");
