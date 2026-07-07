import React, { useState } from "react";
import NewTitle from "../../extra/Title";
import MultiButton from "../../extra/MultiButton";
import ManageAds from "./ManageAds";
import dayjs from "dayjs";
import NewVideoAdd from "../../dialogue/NewVideoAdd";
import { useSelector } from "react-redux";

export default function AdsPage() {
  const [multiButtonSelect, setMultiButtonSelect] = useState("Manage Video");
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );


  const startDateFormat = (startDate) => {
    return startDate && dayjs(startDate).isValid()
      ? dayjs(startDate).format("YYYY-MM-DD")
      : "All";
  };
  const endDateFormat = (endDate) => {
    return endDate && dayjs(endDate).isValid()
      ? dayjs(endDate).format("YYYY-MM-DD") 
      : "All";
  };

  const startDateData = startDateFormat(startDate);
  const endDateData = endDateFormat(endDate);

  return (
    <div className="userPage videoPage">
      <div
        style={{
          display: `${dialogueType === "editVideo" ? "none" : "block"}`,
        }}
      >
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            setMultiButtonSelect={setMultiButtonSelect}
            multiButtonSelect={multiButtonSelect}
            labelData={[
              "Manage Videos",
              "Manage Video Comments",
              "Import Videos",
            ]}
          />
        </div>

        {multiButtonSelect == "Manage Videos" && (
          <ManageAds endDate={endDateData} startDate={startDateData} />
        )}
        {/* {multiButtonSelect == "Manage Video Comments" && (
          <VideoComments endDate={endDateData} startDate={startDateData} />
        )} */}
        {multiButtonSelect == "Import Videos" && (
          <NewVideoAdd setMultiButtonSelect={setMultiButtonSelect} />
        )}
      </div>
      {dialogueType === "editVideo" && <NewVideoAdd />}
    </div>
  );
}
