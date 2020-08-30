import { BLOG_URL, TAG_URL, MARKET_URL } from "../utils/urls";
import { axiosHandler, getToken, errorHandler } from "../utils/helper";
import { Notification } from "../components/notification/Notification";

export const getBlogsFunc = async (extra) => {
  let url = BLOG_URL;
  if (extra) {
    url = url + extra;
  }

  let result = await axiosHandler({
    method: "get",
    url,
    token: getToken(),
  }).catch((e) =>
    Notification.bubble({
      type: "error",
      content: errorHandler(e),
    })
  );

  if (!result) return;
  return result.data;
};

export const getTagList = async (extra) => {
  let url = TAG_URL;
  if (extra) {
    url = url + extra;
  }

  let result = await axiosHandler({
    method: "get",
    url,
    token: getToken(),
  }).catch((e) =>
    Notification.bubble({
      type: "error",
      content: errorHandler(e),
    })
  );

  if (!result) return;
  return result.data;
};

export const addTag = async (data) => {
  let url = TAG_URL + "/";

  let result = await axiosHandler({
    method: "post",
    url,
    data,
    token: getToken(),
  }).catch((e) =>
    Notification.bubble({
      type: "error",
      content: errorHandler(e),
    })
  );

  if (!result) return;
  return result.data;
};

export const addUpdateMarketting = async (data, method = "post", id) => {
  let url = MARKET_URL + "/";
  if (method === "patch") {
    url = url + `${id}/`;
  }

  let result = await axiosHandler({
    method,
    url,
    data,
    token: getToken(),
  }).catch((e) =>
    Notification.bubble({
      type: "error",
      content: errorHandler(e),
    })
  );

  if (!result) return;
  return result.data;
};

export const getMarketting = async (extra) => {
  let url = MARKET_URL + "/";

  if (extra) {
    url = url + extra;
  }

  let result = await axiosHandler({
    method: "get",
    url,
    token: getToken(),
  }).catch((e) =>
    Notification.bubble({
      type: "error",
      content: errorHandler(e),
    })
  );

  if (!result) return;
  return result.data;
};

export const createUpdateBlog = async (data, method = "post", extra) => {
  let url = BLOG_URL;
  if (extra) {
    url = url + extra;
  } else {
    url = url + "/";
  }

  let result = await axiosHandler({
    method,
    url,
    data,
    token: getToken(),
  }).catch((e) =>
    Notification.bubble({
      type: "error",
      content: errorHandler(e),
    })
  );

  if (!result) return;
  return result.data;
};

export const deleteBlog = async (slug) => {
  let url = BLOG_URL + `/${slug}/`;

  let result = await axiosHandler({
    method: "delete",
    url,
    token: getToken(),
  }).catch((e) =>
    Notification.bubble({
      type: "error",
      content: errorHandler(e),
    })
  );

  if (!result) return;
  return result.data;
};

export const deleteMarketting = async (id) => {
  let url = MARKET_URL + `/${id}/`;

  let result = await axiosHandler({
    method: "delete",
    url,
    token: getToken(),
  }).catch((e) =>
    Notification.bubble({
      type: "error",
      content: errorHandler(e),
    })
  );

  if (!result) return;
  return result.data;
};

export const deleteTag = async (title) => {
  let url = TAG_URL + `/${title}/`;

  let result = await axiosHandler({
    method: "delete",
    url,
    token: getToken(),
  }).catch((e) =>
    Notification.bubble({
      type: "error",
      content: errorHandler(e),
    })
  );

  if (!result) return;
  return result.data;
};
