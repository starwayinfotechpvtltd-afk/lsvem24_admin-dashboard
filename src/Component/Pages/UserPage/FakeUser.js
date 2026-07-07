import React, { useEffect, useState } from "react";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import { connect, useDispatch, useSelector } from "react-redux";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Searching from "../../extra/Searching";
import { warning } from "../../../util/Alert";
import AddIcon from "@mui/icons-material/Add";
import UserImage from "../../../assets/images/dummy.png";
import {
  getFakeUser,
  isActiveUser,
  deleteUser,
} from "../../store/user/user.action";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import $, { get } from "jquery";
import ToggleSwitch from "../../extra/ToggleSwitch";
import CreateChannel from "../../dialogue/CreateChannel";
import { Skeleton } from "@mui/material";
import { IconCircleDashedCheck, IconCircleDashedPlus, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import LazyImage from "../../../common/ImageFallback";

function FakeUser(props) {
  const { startDate, endDate } = props;
  const dispatch = useDispatch();
  const [age, setAge] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [actionPagination, setActionPagination] = useState("block");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState();
  const { fakeUser, totalUsersAddByAdmin } = useSelector((state) => state.user);


  const [data, setData] = useState();
  const [showURLs, setShowURLs] = useState([]);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  useEffect(() => {
    setData(fakeUser);
  }, [fakeUser]);

  // $(document).ready(function () {
  //   $("img").bind("error", function () {
  //     // Set the default image
  //     $(this).attr("src", UserImage);
  //   });
  // });

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

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

  const handleSelectCheckData = (e, row) => {

    const checked = e.target.checked;
    if (checked) {
      setSelectCheckData((prevSelectedRows) => [...prevSelectedRows, row]);
    } else {
      setSelectCheckData((prevSelectedRows) =>
        prevSelectedRows.filter((selectedRow) => selectedRow._id !== row._id)
      );
    }
  };
  const handleSelectAll = (event) => {

    const checked = event.target.checked;
    setSelectAllChecked(checked);
    if (checked) {
      setSelectCheckData([...data]);
    } else {
      setSelectCheckData([]);
    }
  };
  const handleCreateChannel = (row, type) => {

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
  const paginationSubmitButton = () => {

    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    const isActiveData = fakeUser.filter((user) => {
      return (
        user.isBlock === false &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });
    const deActiveData = fakeUser.filter((user) => {
      return (
        user.isBlock === true &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });

    const getId = isActiveData?.map((item) => item?._id);
    const getId_ = deActiveData?.map((item) => item?._id);

    if (actionPagination === "block" && selectCheckDataGetId?.length > 0) {
      const data = true;
      props.isActiveUser(getId, "fakeUser", data);
    } else if (actionPagination === "unblock") {
      const data = false;
      props.isActiveUser(getId_, "fakeUser", data);
    } else if (actionPagination === "delete") {
      const data = warning();
      data
        .then((res) => {
          if (res) {
            const yes = res.isConfirmed;
            if (yes) {
              props.deleteUser(selectCheckDataGetId, "fakeUser");
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const ManageUserData = [
    {
      Header: "checkBox",
      width: "20px",
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectCheckData.some(
            (selectedRow) => selectedRow?._id === row?._id
          )}
          onChange={(e) => handleSelectCheckData(e, row)}
        />
      ),
    },
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
      Cell: ({ row, index }) => (
        <div
          className="d-flex align-items-center"
        // style={{ cursor: "pointer" }}
        // onClick={() => handleEdit(row, "manageUser")}
        >
          {/* <img src={row?.image} width="50px" height="50px" /> */}
          <LazyImage imageSrc={row?.image} width="50px" height="50px" />
          <span className="text-capitalize   cursorPointer text-nowrap ms-3">
            {row?.fullName}
          </span>
        </div>
      ),
    },
    {
      Header: "ID",
      body: "uniqueId",
      Cell: ({ row }) => (
        <span className="text-capitalize    cursorPointer">
          {row?.uniqueId}
        </span>
      ),
    },

    {
      Header: "EMAIL",
      body: "email",
      Cell: ({ row }) => (
        <span className="text-lowercase    cursorPointer">{row?.email}</span>
      ),
    },
    {
      Header: "IP ADDRESS",
      body: "callEndReason",
      class: " ",
      Cell: ({ row }) => <span>{row?.ipAddress}</span>,
    },
    {
      Header: "STATUS",
      body: "status",
      Cell: ({ row }) => <span>{row?.isBlock ? "Block" : "UnBlock"}</span>,
    },
    {
      Header: "BLOCK",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isBlock}
          onChange={() => handleIsActive(row)}
        />
      ),
    },
    {
      Header: "CREATE CHANNEL",
      body: "status",
      Cell: ({ row }) => (
        <span className="text-uppercase">
          <div className="action-button create-channel-icon">
            {row?.isChannel === true ? (
              <>
                <IconCircleDashedCheck className="text-success" />
              </>
            ) : (
              <>
                <IconCircleDashedPlus className="text-secondary cursor-pointer" onClick={() => handleCreateChannel(row, "createChannel")} />
              </>
            )}
          </div>
        </span>
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <button className="btn btn-sm" onClick={() => handleEdit(row, "manageUser")}>
            <IconEdit className="text-secondary" />
          </button>
          <button className="btn btn-sm" onClick={() => handleDeleteUser(row)}>
            <IconTrash className="text-secondary" />
          </button>
          {/* <Button
            btnIcon={<EditIcon width="25px" height="25px" />}
            onClick={() => handleEdit(row, "manageUser")}
          />
          <Button
            btnIcon={<TrashIcon width="25px" height="25px" />}
            onClick={() => handleDeleteUser(row)}
          /> */}
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getFakeUser(page, size, startDate, endDate, "addByAdmin"));
  }, [dispatch, startDate, endDate, size, page]);

  const handleIsActive = (row) => {

    const id = row?._id;
    const type = "fakeUser";
    const data = row?.isBlock === false ? true : false;
    props.isActiveUser(id, type, data);
  };

  const handleDeleteUser = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed;
          if (yes) {
            const id = row?._id;
            props.deleteUser(id, "fakeUser");
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
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

  return (
    <div>
      {dialogueType == "createChannel" && <CreateChannel />}
      <div className="user-table fake-user mb-3">
        <div className="user-table-top">

          <h5
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginBottom: "5px",
              marginTop: "5px",
            }}
          >
            Fake User
          </h5>

          <div className="d-flex ">
            <Searching
              label={
                " Search for ID, Keyword, E-mail, Username, First Name, LastName"
              }
              placeholder={"Search..."}
              data={fakeUser}
              type={"client"}
              setData={setData}
              onFilterData={handleFilterData}
              searchValue={search}
              actionPagination={actionPagination}
              setActionPagination={setActionPagination}
              paginationSubmitButton={paginationSubmitButton}
            />
            <Button
              btnIcon={<IconPlus width={20} height={20} />}
              btnName={"New"}
              newClass={"ms-2"}
              onClick={() => handleOpenNew("fakeUserAdd")}
            />
          </div>
        </div>
        <Table
          data={data}
          mapData={ManageUserData}
          serverPerPage={size}
          serverPage={page}
          handleSelectAll={handleSelectAll}
          selectAllChecked={selectAllChecked}
          type={"server"}
        />
        <div>
          <Pagination
            type={"server"}
            activePage={page}
            rowsPerPage={size}
            userTotal={totalUsersAddByAdmin}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getFakeUser,
  isActiveUser,
  deleteUser,
})(FakeUser);
