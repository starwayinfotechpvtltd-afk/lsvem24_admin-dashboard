import * as ActionType from "./ads.type";

const initialState = {
  loading: false,
  adsData: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  adDetail: null,
  activeAds: [],
  analytics: null,
};

export const adReducer = (state = initialState, action) => {
  switch (action.type) {

    // ─── Loading ───────────────────────────────────────────────────────────
    case ActionType.AD_LOADING:
      return {
        ...state,
        loading: true,
      };

    // ─── Get All Ads ───────────────────────────────────────────────────────
    case ActionType.GET_ADS:
      return {
        ...state,
        loading: false,
        adsData: action.payload.ads,
        pagination: action.payload.pagination,
      };

    // ─── Get Single Ad ─────────────────────────────────────────────────────
    case ActionType.GET_AD_BY_ID:
      return {
        ...state,
        adDetail: action.payload,
      };

    // ─── Create Ad ─────────────────────────────────────────────────────────
    case ActionType.CREATE_ADS:
      return {
        ...state,
        adsData: [action.payload, ...state.adsData],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };

    // ─── Update Ad ─────────────────────────────────────────────────────────
    case ActionType.EDIT_ADS:
      return {
        ...state,
        adsData: state.adsData.map((ad) =>
          ad._id === action.payload.id ? { ...ad, ...action.payload.data } : ad
        ),
        // also sync adDetail if it's currently open
        adDetail:
          state.adDetail?._id === action.payload.id
            ? { ...state.adDetail, ...action.payload.data }
            : state.adDetail,
      };

    // ─── Delete Single Ad ──────────────────────────────────────────────────
    case ActionType.DELETE_ADS:
      return {
        ...state,
        adsData: state.adsData.filter((ad) => ad._id !== action.payload),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      };

    // ─── Bulk Delete ───────────────────────────────────────────────────────
    case ActionType.BULK_DELETE_ADS:
      return {
        ...state,
        adsData: state.adsData.filter(
          (ad) => !action.payload.includes(ad._id)
        ),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - action.payload.length,
        },
      };

    // ─── Toggle Single Ad Status ───────────────────────────────────────────
    case ActionType.TOGGLE_AD_STATUS:
      return {
        ...state,
        adsData: state.adsData.map((ad) =>
          ad._id === action.payload.id
            ? { ...ad, isActive: action.payload.isActive }
            : ad
        ),
      };

    // ─── Bulk Toggle Status ────────────────────────────────────────────────
    case ActionType.BULK_TOGGLE_STATUS:
      return {
        ...state,
        adsData: state.adsData.map((ad) =>
          action.payload.ids.includes(ad._id)
            ? { ...ad, isActive: action.payload.isActive }
            : ad
        ),
      };

    // ─── Toggle Single Ad Verification ─────────────────────────────────────
    case ActionType.TOGGLE_AD_VERIFICATION:
      return {
        ...state,
        adsData: state.adsData.map((ad) =>
          ad._id === action.payload.id
            ? { ...ad, isVerified: action.payload.isVerified }
            : ad
        ),
      };

    // ─── Bulk Toggle Verification ──────────────────────────────────────────
    case ActionType.BULK_TOGGLE_VERIFICATION:
      return {
        ...state,
        adsData: state.adsData.map((ad) =>
          action.payload.ids.includes(ad._id)
            ? { ...ad, isVerified: action.payload.isVerified }
            : ad
        ),
      };

    // ─── Record View ───────────────────────────────────────────────────────
    case ActionType.RECORD_AD_VIEW:
      return {
        ...state,
        adsData: state.adsData.map((ad) =>
          ad._id === action.payload.id
            ? { ...ad, views: action.payload.views }
            : ad
        ),
      };

    // ─── Record Click ──────────────────────────────────────────────────────
    case ActionType.RECORD_AD_CLICK:
      return {
        ...state,
        adsData: state.adsData.map((ad) =>
          ad._id === action.payload.id
            ? { ...ad, clicks: action.payload.clicks }
            : ad
        ),
      };

    // ─── Analytics ─────────────────────────────────────────────────────────
    case ActionType.GET_AD_ANALYTICS:
      return {
        ...state,
        analytics: action.payload,
      };

    // ─── Active Ads (for player) ───────────────────────────────────────────
    case ActionType.GET_ACTIVE_ADS:
      return {
        ...state,
        activeAds: action.payload,
      };

    // ─── Reset Ad Stats ────────────────────────────────────────────────────
    case ActionType.RESET_AD_STATS:
      return {
        ...state,
        adsData: state.adsData.map((ad) =>
          ad._id === action.payload.id
            ? { ...ad, views: 0, clicks: 0 }
            : ad
        ),
      };

    default:
      return state;
  }
};