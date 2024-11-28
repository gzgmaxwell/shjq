import request from "@/api/axios";
const scope = "server";

export const loginByUsername = (
  username,
  password,
  code,
  randomStr,
  useGoogleValid
) => {
  const grant_type = "password";

  return request({
    url: "/auth/oauth/token",
    headers: {
      isToken: false,
      Authorization: "Basic cGlnOnBpZw==",
    },
    method: "post",
    params: {
      username,
      password,
      randomStr,
      code,
      grant_type,
      scope,
      useGoogleValid,
    },
  });
};

export const refreshToken = (refresh_token) => {
  const grant_type = "refresh_token";
  return request({
    url: "/auth/oauth/token",
    headers: {
      isToken: false,
      Authorization: "Basic cGlnOnBpZw==",
    },
    method: "post",
    params: { refresh_token, grant_type, scope },
  });
};

export const getUserInfo = () => {
  return request({
    url: "/prm/web/user/info",
    method: "post",
  });
};

export const logout = () => {
  return request({
    url: "/auth/token/logout",
    method: "delete",
  });
};

export const orderOffline = () => {
  return request({
    url: "/examine/web/work/order/offline",
    method: "post",
  });
};

export const userValid = () => {
  return request({
    url: "/prm/web/user/valid",
    method: "post",
  });
};



