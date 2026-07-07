import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import Button from "../../extra/Button";
import { ReactComponent as TrueIcon } from "../../../assets/icons/TrueArrow.svg";
import { ReactComponent as Decline } from "../../../assets/icons/Decline.svg";
import {
  acceptOrDeclineRequest,
  getMonetizationRequest,
} from "../../store/monetization/monetization.action";

import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Reason from "./Reason";
import AcceptedRequestDialog from "./AcceptRequestDialog";
import defaultImage from "../../../assets/images/noimage.png";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import LazyImage from "../../../common/ImageFallback";


const PendingRequest = (props) => {
  const { monetization, total } = useSelector((state) => state.monetization);

  const { dialogueType } = useSelector((state) => state.dialogue);

  const dispatch = useDispatch();

  const { startDate, endDate } = props;

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const [showURLs, setShowURLs] = useState([]);

  useEffect(() => {
    dispatch(getMonetizationRequest(1, page, size, startDate, endDate));
  }, [dispatch, page, size, startDate, endDate]);

  useEffect(() => {
    setData(monetization);
  }, [monetization]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const ManageUserData = [
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }) => (
        <span className="  text-nowrap">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },

    {
      Header: "USERNAME",
      body: "userName",
      Cell: ({ row }) => (
        <div className="d-flex align-items-center" style={{ cursor: "pointer" }}>
          {/* <img
            src={row?.userId?.image}
            width="50px"
            height="50px"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage; // fallback image
            }}
          /> */}
          <LazyImage imageSrc={row?.userId?.image} width="50px" height="50px" />
          <span className="text-capitalize cursorPointer text-nowrap ms-3">
            {row?.userId?.fullName}
          </span>
        </div>
      ),

    },
    {
      Header: "CHANNEL NAME",
      body: "channelName",
      Cell: ({ row }) => <span>{row?.channelName}</span>,
    },

    {
      Header: "TOTAL WATCH TIME (MINUTES)",
      body: "totalWatchTime",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">
          {row?.totalWatchTime}
        </span>
      ),
    },
    {
      Header: "TOTAL WATCH TIME (HOURS)",
      body: "totalWatchTimeInHours",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">
          {row?.totalWatchTimeInHours}
        </span>
      ),
    },


    {
      Header: "CREATED AT",
      body: "createdAt",
      Cell: ({ row }) => <span>{row?.requestDate}</span>,
    },

    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          {/* <Button
            btnIcon={<TrueIcon width="25px" height="25px" />}
            onClick={() => handleAccept(row)}
          />
          <Button
            btnIcon={<Decline width="25px" height="25px" />}
            onClick={() => handleDecline(row, "manageUser")}
          /> */}
          <button className="btn btn-sm" onClick={() => handleAccept(row)}>
            <IconEdit className="text-secondary" />
          </button>
          <button className="btn btn-sm" onClick={() => handleDecline(row, "manageUser")}>
            <IconTrash className="text-secondary" />
          </button>
        </div>
      ),
    },
  ];

  const handleAccept = (row) => {

    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        type: "accept",
        data: row,
      },
    });
  };

  const handleDecline = (row) => {

    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        type: "monetization",
        data: row,
      },
    });
    let dialogueData_ = {
      dialogue: true,
      type: "monetization",
      dialogueData: row,
    };
    sessionStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  return (
    <div>
      <div className="user-table real-user mb-3">
        {dialogueType == "monetization" && <Reason />}
        {dialogueType == "accept" && <AcceptedRequestDialog />}

        <div className="user-table-top">
          <h5
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginBottom: "5px",
              marginTop: "5px",
            }}
          >
            Monetization Request Table
          </h5>
        </div>
        <Table
          data={data}
          mapData={ManageUserData}
          serverPerPage={size}
          serverPage={page}
          type={"server"}
        />
        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          userTotal={total}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default PendingRequest;
