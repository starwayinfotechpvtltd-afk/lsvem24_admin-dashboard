import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import AddIcon from "@mui/icons-material/Add";
import NewTitle from "../../extra/Title"
import { connect, useDispatch, useSelector } from "react-redux";
import { getCoinPlan, isActiveCoinPlan, isPopularCoinPlan } from "../../store/coinPlan/coinPlan.action";
import { getDefaultCurrency } from "../../store/currency/currency.action";
import { useEffect, useState } from "react";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";

import CreatePlan from "../../dialogue/CreatePlan";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg"
import ToggleSwitch from "../../extra/ToggleSwitch"
import dayjs from "dayjs";
import { IconEdit, IconPlus } from "@tabler/icons-react";
const CoinPlanTable = (props) => {
  const [data, setData] = useState();
  const coinPlanData = useSelector((state) => state.coinPlan);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const { defaultCurrency } = useSelector((state) => state.currency);


  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getCoinPlan());
    dispatch(getDefaultCurrency());
  }, [dispatch, page, size]);

  useEffect(() => {
    setData(coinPlanData?.coinPlanData);
  }, [coinPlanData?.coinPlanData]);

  const planTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{(page - 1) * size + index + 1}</span>,
    },

    // {
    //   Header: "Image",
    //   body: "Image",
    //   Cell: ({ row }) => (
    //     <span className="text-capitalize">
    //       <img src={row?.icon} alt={row?.planBenefit} height={50} width={50} />
    //     </span>
    //   ),
    // },
    {
      Header: `AMOUNT (${defaultCurrency?.symbol})`,
      body: "amount",
      Cell: ({ row }) => {
        return <span className="text-capitalize">{row?.amount || "-"}</span>;
      },
    },
    {
      Header: "COIN",
      body: "coin",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.coin || "-"}</span>
      ),
    },
    {
      Header: "EXTRA COIN",
      body: "extracoin",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.extraCoin || "-"}</span>
      ),
    },

    {
      Header: "ACTIVE",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onChange={() => handleIsActive(row)}
        />
      ),
    },
    {
      Header: "POPULAR",
      body: "isPopular",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isPopular}
          onChange={() => handleIsPopular(row)}
        />
      ),
    },
    {
      Header: "CREATE DATE",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMMM YYYY") : ""}
        </span>
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          {/* <Button
            btnIcon={<EditIcon />}
            onClick={() => handleEdit(row, "coinPlanAdd")}
          /> */}
          <button className="btn btn-sm" onClick={() => handleEdit(row, "coinPlanAdd")}>
            <IconEdit className="text-secondary" />
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

  const handleOpenNew = (type) => {

    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        type: type,
      },
    });

    let dialogueData_ = {
      dialogue: true,
      type: type,
    };
    sessionStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };


  const handleIsActive = (row) => {

    const id = row?._id;
    const data = row?.isActive === false ? true : false;
    props.isActiveCoinPlan(id, data);
  };
  const handleIsPopular = (row) => {

    const id = row?._id;
    const data = row?.isPopular === false ? true : false;
    props.isPopularCoinPlan(id, data);
  };

  useEffect(() => {
    dispatch(getCoinPlan());
    dispatch(getDefaultCurrency());
  }, [dispatch]);

  return (
    <div className="  userPage ">
      {dialogueType == "coinPlanAdd" && <CreatePlan />}
      {/* <div className="dashboardHeader primeHeader mb-3 p-0">
        <NewTitle
          dayAnalyticsShow={false}
          titleShow={true}
          name={`Coin Plan`}
        />
      </div> */}
      <div className="user-table">
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
                Coin Plan
              </h5>
            </div>
            <div className="w-100 d-flex justify-content-end">
              <Button
                btnIcon={<IconPlus width={18} height={18} />}
                newClass={""}
                btnName={"New"}
                onClick={() => handleOpenNew("coinPlanAdd")}
              />
            </div>
          </div>
        </div>
        <div className="">
          <Table
            data={coinPlanData?.coinPlanData}
            mapData={planTable}
            PerPage={size}
            Page={page}
            type={"client"}

          />
          {/* <Pagination
            type={"client"}
            activePage={page}
            rowsPerPage={size}
            userTotal={coinPlanData?.coinPlanData?.length}
            setPage={setPage}
            setData={setData}
            data={data}
            actionShow={false}

          /> */}
        </div>
      </div>
    </div>
  )
}
// export default CoinPlanTable;
export default connect(null, {
  isActiveCoinPlan,
  isPopularCoinPlan
})(CoinPlanTable);