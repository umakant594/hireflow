import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("hireflow_token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute =
      window.location.pathname.endsWith("/login") ||
      window.location.hash === "#/login";

    if (
      error.response?.status === 401 &&
      !isLoginRoute
    ) {
      localStorage.removeItem(
        "hireflow_token"
      );

      localStorage.removeItem(
        "hireflow_user"
      );

      window.location.hash = "#/login";
    }

    return Promise.reject(error);
  }
);

export default api;