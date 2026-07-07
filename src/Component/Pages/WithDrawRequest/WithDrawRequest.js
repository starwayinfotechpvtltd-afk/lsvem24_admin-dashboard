import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import { useDispatch, useSelector } from "react-redux";
import { getWithDrawRequest } from "../../store/withdraw/withdraw.action";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import Button from "../../extra/Button";
import { ReactComponent as TrueIcon } from "../../../assets/icons/TrueArrow.svg";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";

import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import { type } from "@testing-library/user-event/dist/type";
import Reason from "./Reason";
import { getDefaultCurrency } from "../../store/currency/currency.action";
import InfoDialog from "./InfoDialog";
import defaultImage from "../../../assets/images/noimage.png";
import { IconEdit, IconTrash } from "@tabler/icons-react";

const WithDrawRequest = (props) => {
  const { withdraw, total } = useSelector((state) => state.withdraw);

  const { dialogueType } = useSelector((state) => state.dialogue);
  const { defaultCurrency } = useSelector((state) => state.currency);

  const dispatch = useDispatch();

  const { startDate, endDate } = props;

  const [page, setPage] = useState(1);

  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getWithDrawRequest(1, page, size, startDate, endDate));
    dispatch(getDefaultCurrency());
  }, [dispatch, page, size, startDate, endDate]);

  useEffect(() => {
    setData(withdraw);
  }, [withdraw]);



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
        alt="user"
        className="rounded-circle me-2"
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
      Header: `REQUEST AMOUNT(${defaultCurrency?.symbol ? defaultCurrency?.symbol : ""
        })`,
      body: "requestAmount",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">
          {row?.requestAmount}
        </span>
      ),
    },
    {
      Header: "PAYMENTGATEWAY",
      body: "paymentGateway",
      Cell: ({ row }) => <span>{row?.paymentGateway}</span>,
    },
    {
      Header: "CREATEDAT",
      body: "createdAt",
      Cell: ({ row }) => <span>{row?.requestDate}</span>,
    },



    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          {/* <Button
            btnName={`Pay`}
            newClass={`fw-bolder bg-success text-white w-70`}
            onClick={() => handleEdit(row, "pay")}
          />
          <Button
            btnName={`Decline`}
            newClass={`fw-bolder bg-danger text-white w-70`}
            onClick={() => handleDecline(row, "decline")}
          /> */}

          <button className="btn btn-sm" onClick={() => handleEdit(row, "pay")}>
            <IconEdit className="text-secondary" />
          </button>
          <button className="btn btn-sm" onClick={() => handleDecline(row, "decline")}>
            <IconTrash className="text-secondary" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (row, type) => {

    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        type: type,
        data: row,
      },
    });

    let dialogueData_ = {
      dialogue: true,
      type: type,
      dialogueData: row,
    };
    sessionStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  const handleDecline = (row, type) => {

    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        type: type,
        data: row,
      },
    });
    let dialogueData_ = {
      dialogue: true,
      type: type,
      dialogueData: row,
    };
    sessionStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  return (
    <div>
      <div className="user-table real-user mb-3">
        {dialogueType == "decline" && <Reason />}
        {dialogueType == "info" && <InfoDialog />}

        <div className="user-table-top">
          <h5
            style={{
              fontWeight: "500",
              fontSize: "20px",
            }}
          >
            Withdrawal Request
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

export default WithDrawRequest;
