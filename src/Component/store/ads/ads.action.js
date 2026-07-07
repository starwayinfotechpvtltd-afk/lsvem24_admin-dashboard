import axios from "axios";
import * as ActionType from "./ads.type";
import { setToast } from "../../../util/toast";
import { apiInstanceFetch } from "../../../util/api";
import { baseURL } from "../../../util/config";

// ─── GET ALL ADS ─────────────────────────────────────────────────────────────
// Maps to: GET /api/ads?page=&limit=&type=&placement=&isActive=&search=

const adminData = JSON.parse(sessionStorage.getItem("admin"));
const userId = adminData?.userId;
console.log(adminData);
const admin = sessionStorage.getItem("isAdmin");
console.log(admin);

export const getAdsApi =
  (type, page = 1, limit = 10, search = "", placement = "", isActive = "") =>
  (dispatch) => {
    dispatch({ type: ActionType.AD_LOADING });

    let url;
    if (admin === "true") {
      url = `admin/ads/allads?page=${page}&limit=${limit}`;
      if (type) url += `&type=${type}`;
      if (placement) url += `&placement=${placement}`;
      if (search) url += `&search=${search}`;
      if (isActive !== "") url += `&isActive=${isActive}`;
    } else {
      url = `admin/ads/allads`;
    }

    apiInstanceFetch
      .get(url)
      .then((res) => {
        if (res.success) {
          console.log(res.data);
          dispatch({
            type: ActionType.GET_ADS,
            payload: {
              ads: res.data,
              pagination: res.pagination,
            },
          });
        } else {
          setToast("error", res.message);
        }
      })
      .catch((error) => {
        console.error("getAdsApi error:", error);
        setToast("error", error.message);
      });
  };

// ─── GET SINGLE AD ────────────────────────────────────────────────────────────
// Maps to: GET /api/ads/:id

export const getAdByIdApi = (id) => (dispatch) => {
  apiInstanceFetch
    .get(`admin/ads/${id}`)
    .then((res) => {
      if (res.success) {
        dispatch({ type: ActionType.GET_AD_BY_ID, payload: res.data });
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => {
      console.error("getAdByIdApi error:", error);
      setToast("error", error.message);
    });
};

// ─── CREATE AD ────────────────────────────────────────────────────────────────
// Maps to: POST /api/ads  (multipart/form-data)

export const createAd = (formData) => (dispatch) => {
  axios
    .post(`${baseURL}/admin/ads`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      if (res.data.success) {
        dispatch({ type: ActionType.CREATE_ADS, payload: res.data.data });
        setToast("success", "Ad created successfully!");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.error("createAd error:", error);
      setToast("error", error.message);
    });
};

// ─── UPDATE AD ────────────────────────────────────────────────────────────────
// Maps to: PUT /api/ads/:id  (multipart/form-data)

export const updateAd = (id, formData) => (dispatch) => {
  axios
    .put(`${baseURL}/admin/ads/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      if (res.data.success) {
        dispatch({
          type: ActionType.EDIT_ADS,
          payload: { id, data: res.data.data },
        });
        setToast("success", "Ad updated successfully!");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.error("updateAd error:", error);
      setToast("error", error.message);
    });
};

// ─── DELETE AD ────────────────────────────────────────────────────────────────
// Maps to: DELETE /api/ads/:id

export const deleteAd = (id) => (dispatch) => {
  axios
    .delete(`${baseURL}/admin/ads/${id}`)
    .then((res) => {
      if (res.data.success) {
        dispatch({ type: ActionType.DELETE_ADS, payload: id });
        setToast("success", "Ad deleted successfully!");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.error("deleteAd error:", error);
      setToast("error", error.message);
    });
};

// ─── BULK DELETE ──────────────────────────────────────────────────────────────
// Maps to: DELETE /api/ads/bulk  — Body: { ids: [...] }

export const bulkDeleteAds = (ids) => (dispatch) => {
  axios
    .delete(`${baseURL}/admin/ads/bulk`, { data: { ids } })
    .then((res) => {
      if (res.data.success) {
        dispatch({ type: ActionType.BULK_DELETE_ADS, payload: ids });
        setToast("success", res.data.message);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.error("bulkDeleteAds error:", error);
      setToast("error", error.message);
    });
};

// ─── TOGGLE ACTIVE ────────────────────────────────────────────────────────────
// Maps to: PATCH /api/ads/:id/toggle

export const toggleAdStatus = (id) => (dispatch) => {
  axios
    .patch(`${baseURL}/admin/ads/${id}/toggle`)
    .then((res) => {
      if (res.data.success) {
        dispatch({
          type: ActionType.TOGGLE_AD_STATUS,
          payload: { id, isActive: res.data.isActive },
        });
        setToast("success", res.data.message);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.error("toggleAdStatus error:", error);
      setToast("error", error.message);
    });
};

// ─── BULK TOGGLE ──────────────────────────────────────────────────────────────
// Maps to: PATCH /api/ads/bulk/toggle  — Body: { ids: [...], isActive: bool }

export const bulkToggleStatus = (ids, isActive) => (dispatch) => {
  axios
    .patch(`${baseURL}/admin/ads/bulk/toggle`, { ids, isActive })
    .then((res) => {
      if (res.data.success) {
        dispatch({
          type: ActionType.BULK_TOGGLE_STATUS,
          payload: { ids, isActive },
        });
        setToast("success", res.data.message);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.error("bulkToggleStatus error:", error);
      setToast("error", error.message);
    });
};

// ─── RECORD VIEW ──────────────────────────────────────────────────────────────
// Maps to: PATCH /api/ads/:id/view

export const recordAdView = (id) => (dispatch) => {
  axios
    .patch(`${baseURL}/admin/ads/${id}/view`)
    .then((res) => {
      if (res.data.success) {
        dispatch({
          type: ActionType.RECORD_AD_VIEW,
          payload: { id, views: res.data.views },
        });
      }
    })
    .catch((error) => console.error("recordAdView error:", error));
};

// ─── RECORD CLICK ─────────────────────────────────────────────────────────────
// Maps to: PATCH /api/ads/:id/click

export const recordAdClick = (id) => (dispatch) => {
  axios
    .patch(`${baseURL}/admin/ads/${id}/click`)
    .then((res) => {
      if (res.data.success) {
        dispatch({
          type: ActionType.RECORD_AD_CLICK,
          payload: { id, clicks: res.data.clicks },
        });
      }
    })
    .catch((error) => console.error("recordAdClick error:", error));
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
// Maps to: GET /api/ads/analytics

export const getAdAnalytics = () => (dispatch) => {
  apiInstanceFetch
    .get("admin/ads/analytics")
    .then((res) => {
      if (res.success) {
        dispatch({ type: ActionType.GET_AD_ANALYTICS, payload: res.data });
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => {
      console.error("getAdAnalytics error:", error);
      setToast("error", error.message);
    });
};

// ─── GET ACTIVE ADS (for player) ──────────────────────────────────────────────
// Maps to: GET /api/ads/active?type=&placement=&tags=

export const getActiveAds =
  (type = "", placement = "", tags = "") =>
  (dispatch) => {
    let url = "admin/ads/active";
    const params = [];
    if (type) params.push(`type=${type}`);
    if (placement) params.push(`placement=${placement}`);
    if (tags) params.push(`tags=${tags}`);
    if (params.length) url += `?${params.join("&")}`;

    apiInstanceFetch
      .get(url)
      .then((res) => {
        if (res.success) {
          dispatch({ type: ActionType.GET_ACTIVE_ADS, payload: res.data });
        } else {
          setToast("error", res.message);
        }
      })
      .catch((error) => {
        console.error("getActiveAds error:", error);
        setToast("error", error.message);
      });
  };

// ─── RESET AD STATS ───────────────────────────────────────────────────────────
// Maps to: PATCH /api/ads/:id/reset-stats

export const resetAdStats = (id) => (dispatch) => {
  axios
    .patch(`${baseURL}/admin/ads/${id}/reset-stats`)
    .then((res) => {
      if (res.data.success) {
        dispatch({ type: ActionType.RESET_AD_STATS, payload: { id } });
        setToast("success", "Ad stats reset successfully!");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.error("resetAdStats error:", error);
      setToast("error", error.message);
    });
};
