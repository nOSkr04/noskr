import axios from "axios";

const API_KEY = "42590893-ce38a55ef102ab89553f50724";

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params: any) => {
  let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true";
  if (!params) {
    return null;
  }
  let paramsKeys = Object.keys(params);
  paramsKeys.map((key) => {
    let value = key === "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  return url;
};

export const apiCall = async (params: any) => {
  try {
    const response = await axios.get(formatUrl(params));
    const { data } = response;
    return {
      success: true,
      data,
    };
  } catch (err: any) {
    console.log(err);
    return { success: false, msg: err.message };
  }
};
