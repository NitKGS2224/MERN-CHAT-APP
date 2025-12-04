
import axios from "axios"

const baseUrl = {
  "backend": "http://localhost:5000"
}
export const api = axios.create({
  url: baseUrl,
});
api.interceptors.request.use((config) => {
  const auth = useAuth();
  if (auth?.token)
    config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
})

