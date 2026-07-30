import axios from "axios";
import * as ActionType from "./report.type";
import { setToast } from "../../../util/toast";
import { apiInstanceFetch } from "../../../util/api";
import {baseURL , secretKey} from "../../../util/config"

export const getVideoReport = (start,limit,startDate,endDate,type) => (dispatch) => {
  apiInstanceFetch
      .get(`admin/report/getReports?start=${start}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&videoType=${type}`)
      .then((res) => {
        dispatch({ type: ActionType.GET_VIDEO_REPORT, payload:{data:res.reports,totalData:res.totalReports} });
      })
      .catch((error) => console.error(error));
  };
  
  export const deleteVideoReport = (id) => (dispatch) => {
  const reportId = Array.isArray(id) ? id.join(",") : id;
  axios
    .delete(`${baseURL}/admin/report/deleteVideoReport?reportId=${reportId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_VIDEO_REPORT, payload: { id: id } });
        setToast("success", "Report Deleted Successfully");
      } else {
        setToast("error", res.data.message || "Failed to delete report");
      }
    })
    .catch((error) => {
      console.log(error);
      setToast("error", error.message || "Failed to delete report");
    });
};

  export const cleanReportData = () => (dispatch) => {
    dispatch({ type: ActionType.CLEAN_REPORT });
  };
  