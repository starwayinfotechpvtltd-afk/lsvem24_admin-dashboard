import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getAdminEarnings, getCoinPlanEarnings } from "../../store/admin/admin.action";
import dayjs from "dayjs";
import { getDefaultCurrency } from "../../store/currency/currency.action";
import { useNavigate , useLocation } from "react-router-dom";



const CoinPlanHistory = () => {
    const { earning, total, totalEarning } = useSelector((state) => state.admin);
    const { defaultCurrency } = useSelector((state) => state.currency);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();

    const coinPlanHistoryData = location?.state?.data;
    const [data, setData] = useState();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [startDate, setStartDate] = useState("All");
    const [endDate, setEndDate] = useState("All");
    const [showURLs, setShowURLs] = useState([]);


    useEffect(() => {
        dispatch(getCoinPlanEarnings(startDate, endDate, page, size));
        dispatch(getDefaultCurrency());
    }, [dispatch, startDate, endDate, page, size]);

    useEffect(() => {
        setData(coinPlanHistoryData?.coinPlanPurchase);
    }, [coinPlanHistoryData?.coinPlanPurchase]);

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
            Header: "UNIQUEID",
            body: "uniqueId",
            Cell: ({ row }) => (
                <span className="text-capitalize">{row?.uniqueId}</span>
            ),
        },
        {
            Header: "COIN",
            body: "coin",
            Cell: ({ row }) => (
                <span className="text-capitalize">
                    {row?.coin}
                </span>
            ),
        },

        {
            Header: `AMOUNT (${defaultCurrency?.symbol})`,
            body: "amount",
            Cell: ({ row }) => (
                <span className="text-capitalize">
                    {row?.amount}
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
        <div className="userPage withdrawal-page">
            <div className="dashboardHeader primeHeader mb-3 p-0">
                <NewTitle
                    dayAnalyticsShow={true}
                    // titleShow={true}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    startDate={startDate}
                    endDate={endDate}
                    // name={`Coin Plan Earning`}
                />
            </div>
            <div className=" user-table">
              <div className="user-table-top">
                    
                        <h5 className="m-0"
                            style={{
                                fontWeight: "500",
                                fontSize: "20px",
                            }}
                        >
                            Coin Plan Purchase History
                        </h5>
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

export default CoinPlanHistory;
