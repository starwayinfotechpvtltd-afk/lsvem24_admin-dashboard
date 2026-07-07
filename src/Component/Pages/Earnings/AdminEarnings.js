import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { cleanData, getAdminEarnings } from "../../store/admin/admin.action";
import dayjs from "dayjs";
import dummy from "../../../assets/images/dummy.png"
import { getDefaultCurrency } from "../../store/currency/currency.action";
import LazyImage from "../../../common/ImageFallback";

const AdminEarnings = (props) => {
  const { earning, total, totalEarning } = useSelector((state) => state.admin);
  const { defaultCurrency } = useSelector((state) => state.currency);
  const { startDate, endDate } = props;

  const dispatch = useDispatch();

  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [showURLs, setShowURLs] = useState([]);

  useEffect(() => {
    dispatch(getAdminEarnings(startDate, endDate, page, size));
    // dispatch(getDefaultCurrency());

    return () => {
      dispatch(cleanData())
    };
  }, [dispatch, startDate, endDate, page, size]);

  useEffect(() => {
    setData(earning);
  }, [earning]);



  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const earningTable = [
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
      Header: "USER NAME",
      body: "fullName",
      Cell: ({ row, index }) => (
        // <div
        //   className="d-flex align-items-center "
        //   style={{ cursor: "pointer" }}
        //   onClick={() => handleEdit(row, "manageUser")}
        // >

        //   <img src={showURLs[index]} width="40px" height="40px"
        //     onError={(e) => {
        //       e.target.onerror = null;
        //       e.target.src = {dummy};
        //     }}
        //   />
        //   <span className="text-capitalize   cursorPointer text-nowrap">
        //     {row?.fullName}
        //   </span>
        // </div>
        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
          // onClick={() => handleEdit(row, "manageUser")}
        >
          {/* <img
            src={row?.image}
            width="50px"
            height="50px"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = dummy;
            }}
          /> */}

          <LazyImage imageSrc={row?.image} width="50px" height="50px" />

          <span className="text-capitalize cursorPointer text-nowrap ms-3">
            {row?.fullName}
          </span>
        </div>
      ),
    },
    {
      Header: "AMOUNT",
      body: "amount",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {row?.amount + " " + defaultCurrency?.symbol}
        </span>
      ),
    },
    {
      Header: "PAYMENT GATEWAY",
      body: "paymentGateway",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.paymentGateway}</span>
      ),
    },
    {
      Header: "VALIDITY",
      body: "validity",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.validity}</span>
      ),
    },
    {
      Header: "VALIDITY TYPE",
      body: "validityType",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.validityType ? row?.validityType : "-"}</span>
      ),
    },
    {
      Header: "CREATED AT",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {dayjs(row.createdAt).format("MM/DD/YYYY")}
        </span>
      ),
    },
  ];
  return (
    <div className=" ">
      <div className=" user-table">
        {/* <div className="row align-items-center mb-2 p-3 ml-1">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6">
            <h5
              style={{
                fontWeight: "500",
                fontSize: "20px",
              }}
            >
              Premium Plan Earning
            </h5>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn d-flex justify-content-end">
            <h4
              style={{
                fontWeight: "500",
                fontSize: "20px",
                marginBottom: "0px",
                marginTop: "5px",
                padding: "3px",
              }}
            >
              Total Admin Earning :{" "}
              {totalEarning + " " + defaultCurrency?.symbol}
            </h4>
          </div>
        </div> */}
        <div className="user-table-top">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="w-100">
                <h5
                  style={{
                    fontWeight: "500",
                    fontSize: "20px",
                  }}
                  className="m-0"
                >
                  Premium Plan Earning
                </h5>
              </div>

              <div className="w-100 d-flex justify-content-end">
                <p className="fw-medium m-0 text-success">
                Admin Earning :
                  {totalEarning + " " + defaultCurrency?.symbol}
                </p>
              </div>
            </div>
          </div>
        <div className="">
          <Table
            data={data}
            mapData={earningTable}
            serverPerPage={size}
            serverPage={page}
            type={"server"}
          />
          <div className="">
            <Pagination
              type={"server"}
              activePage={page}
              actionShow={false}
              rowsPerPage={size}
              userTotal={total}
              setPage={setPage}
              handleRowsPerPage={handleRowsPerPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEarnings;
