import axios from "axios";
import * as ActionType from "./video.type";
import { setToast } from "../../../util/toast";
import { apiInstanceFetch } from "../../../util/api";
import { baseURL, secretKey } from "../../../util/config";

// admin/video/getVideos?videoType=${type}&start=${start}&limit=${limit}&startDate=${startDate}&endDate=${endDate}
const adminData = JSON.parse(sessionStorage.getItem("admin"));
const userId = adminData?.userId;
console.log(adminData);
const admin = sessionStorage.getItem("isAdmin");

export const getVideoApi =
  (type, start, limit, startDate, endDate) => (dispatch) => {
    apiInstanceFetch
      .get(admin === "true"? `admin/video/getVideos`: `admin/video/getVideos?videoType=${type}&userId=${userId}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`,
      )
      .then((res) => {
        dispatch({
          type: ActionType.GET_VIDEO,
          payload: {
            video: res.videos,
            totalVideo: res.totalVideosOrShorts,
          },
        });
      })
      .catch((error) => console.error(error));
  };

export const getFakeUserName = () => (dispatch) => {
  apiInstanceFetch
    .get(`${baseURL}/admin/user/getUsersAddByAdminForChannel`)
    .then((res) => {
      dispatch({
        type: ActionType.GET_FAKE_USER_NAME,
        payload: res.users,
      });
    })
    .catch((error) => console.error(error));
};

export const createVideo = (formData) => (dispatch) => {
  axios
    .post(`${baseURL}/admin/video/uploadVideo`, formData)
    .then((res) => {
      console.log("res.data-->", res.data);
      if (res.data.status) {
        dispatch({
          type: ActionType.IMPORT_VIDEO,
          payload: res.data.video,
        });
        setToast("success", "Video created Successfully !");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.error(error));
};

export const editVideo =
  (data, videoId, userId, channelIdFind, type, fullNameUser) => (dispatch) => {
    axios
      .patch(
        `${baseURL}/admin/video/updateVideo?videoId=${videoId}&userId=${userId}&channelId=${channelIdFind}&videoType=${type}`,
        data,
      )
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: ActionType.EDIT_VIDEO,
            payload: {
              data: res.data.video,
              videoId: videoId,
              fullName: fullNameUser,
            },
          });
          setToast(
            "success",
            `${
              type === 1 ? "Video Edit SuccessFully" : "Short Edit SuccessFully"
            }`,
          );
        } else {
          setToast("error", res.data.message);
        }
      })
      .catch((error) => console.log("error", error.message));
  };

export const deleteVideo = (id) => (dispatch) => {
  axios
    .delete(`${baseURL}/admin/video/deleteVideo?videoId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_VIDEO, payload: { id: id } });
        setToast("success", "Video Delete SuccessFully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

export const getCommentsApi =
  (start, limit, startDate, endDate, type) => (dispatch) => {
    apiInstanceFetch
      .get(
        `${baseURL}/admin/VideoComment/commentsOfVideos?start=${start}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&videoType=${type}`,
      )
      .then((res) => {
        dispatch({
          type: ActionType.COMMENT_GET,
          payload: {
            videoComments: res.commentsOfVideos,
            totalVideoComment: res.totalComments,
          },
        });
      })
      .catch((error) => console.error(error));
  };

export const deleteVideoComments = (id) => (dispatch) => {
  axios
    .delete(
      `${baseURL}/admin/videoComment/deleteVideoComment?videoCommentId=${id}`,
    )
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_VIDEO_COMMENTS,
          payload: { id: id },
        });
        setToast("success", "Comment Delete SuccessFully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
