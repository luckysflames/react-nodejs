import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password) => {
  const { data } = await $host.post("api/user/registration", {
    email,
    password,
    role: "ADMIN",
  });
  localStorage.setItem("token", data.token);
  const decoded = jwtDecode(data.token);
  return decoded;
};

export const login = async (email, password) => {
  const { data } = await $host.post("api/user/login", {
    email,
    password,
  });
  console.log(data);
  localStorage.setItem("token", data.token);
  const decoded = jwtDecode(data.token);
  return decoded;
};

export const check = async () => {
  const { data } = await $authHost.get("api/user/auth");
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};
