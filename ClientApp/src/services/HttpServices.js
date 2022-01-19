import Axios from "axios";
import { toast } from "react-toastify";

Axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log(error);
    toast.error("Unexpected error occur");
  }

  return Promise.reject(error);
});

const CRUD = {
  post: Axios.post,
  put: Axios.put,
  get: Axios.get,
};

export default CRUD;
