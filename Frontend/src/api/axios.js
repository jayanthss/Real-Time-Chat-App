import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  // response successfull
  (response) => {
    // console.log("response recived");
    return response;
  },

  // response error
  async (error) => {
    // console.log("response recived", error.response?.status);

    const originalRequest = error.config;
    let status_code = error.response?.status;
    if (!error.response) {
      return Promise.reject({
        message: "Server is Unaviable , try again later",
        status: 0,
      });
    }

    // Error_handler(status_code,originalRequest,error)
    switch (status_code) {
      case 401:
        try {
          const res = await api.post("/api/auth/refresh");
          const newAccessToken = res.data.access_token;

          // store new token
          localStorage.setItem("Token", newAccessToken);

          // retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // console.log(originalRequest);
          return api(originalRequest);
        } catch (err) {
          // console.log("eroor in axios", err);
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }

      case 403:
        return Promise.reject({ message: "Access denied", status: 403 });

      case 404:
        return Promise.reject({ message: "", staus: 404 });

      case 500:
        return Promise.reject({
          message: "Internal Server error",
          status: 500,
        });

      case 503:
        return Promise.reject({
          message: "Server unavilable, try again later",
          status: 503,
        });
    }
  }
);

export { api };
