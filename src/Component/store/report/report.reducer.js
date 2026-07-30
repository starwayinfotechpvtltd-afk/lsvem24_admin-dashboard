import * as ActionType from "./report.type";

const initialState = {
  videoReport: [],
  totalVideoReport: null
};

export const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_VIDEO_REPORT:
      return {
        ...state,
        videoReport: action.payload.data,
        totalVideoReport: action.payload.totalData,
      };
    case ActionType.DELETE_VIDEO_REPORT:
      const deletedIds = Array.isArray(action.payload.id)
        ? action.payload.id
        : [action.payload.id];
      return {
        ...state,
        videoReport: state.videoReport.filter((item) => !deletedIds.includes(item._id)),
      };

    case ActionType.CLEAN_REPORT:
      return {
        ...state,
        videoReport: [],
        totalVideoReport: "",
      };

    default:
      return state;
  }
};