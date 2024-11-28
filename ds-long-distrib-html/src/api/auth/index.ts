import request from "../request";

/**
 * 登录API
 * @param data {LoginData}
 * @returns
 */
export const authOauthToken = (
  username: string,
  password: string,
  code: string,
  randomStr: string,
  useGoogleValid?: number
) => {
  const grant_type = "password";
  const scope = "server";
  return request({
    url: "/auth/oauth/token",
    headers: {
      isToken: false,
      Authorization: "Basic cGlnOnBpZw==",
    },
    method: "post",
    params: { username, password, randomStr, code, grant_type, scope, useGoogleValid },
  });
};

export function menuGetUserMenu(id: any) {
  return request({
    url: "/prm/web/menu/getChannelUserMenu",
    data: { parentId: id },
    method: "post",
  });
}

export const tokenLogout = () => {
  return request({
    url: "/auth/token/logout",
    method: "delete",
  });
};

export const getCheckCode = (randomStr: any) => {
  return request({
    url: "/code?randomStr=" + randomStr,
    method: "post",
    responseType: "blob",
  });
};

export const channelUserByUserId = () => {
  return request({
    url: "/prm/web/user/channelUserByUserId",
    method: "post",
  });
};
