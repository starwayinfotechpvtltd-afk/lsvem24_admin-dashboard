import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWithDrawRequest } from "../../store/withdraw/withdraw.action";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { getDefaultCurrency } from "../../store/currency/currency.action";
import defaultImage from "../../../assets/images/noimage.png";
import LazyImage from "../../../common/ImageFallback";

const AcceptedRequest = (props) => {
  const { withdraw, total } = useSelector((state) => state.withdraw);
  const { defaultCurrency } = useSelector((state) => state.currency);
  const dispatch = useDispatch();
  const { startDate, endDate } = props;

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getWithDrawRequest(2, page, size, startDate, endDate));
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
      Header: "STATUS",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button text-success">Accepted</div>
      ),
    },
  ];
  return (
    <div>
      <div className="user-table real-user mb-3">
        <div className="user-table-top">
          <h5
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginBottom: "5px",
              marginTop: "5px",
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

export default AcceptedRequest;
