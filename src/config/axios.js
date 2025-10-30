import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

// Attach token before each request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // Skip login & signup
  if (token && !config.url.includes("/auth/login") && !config.url.includes("/auth/signup")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/auth/refresh",
          { withCredentials: true }
        );

        localStorage.setItem("accessToken", res.data.accessToken); // match key
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
