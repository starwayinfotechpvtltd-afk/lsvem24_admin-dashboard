import React, { useEffect, useState } from "react";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import { connect, useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import UserImage from "../../../assets/images/8.jpg";
import Searching from "../../extra/Searching";
import { cleanUserData, deleteChanel, getUserChannels } from "../../store/user/user.action";
import Button from "../../extra/Button";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import { warning } from "../../../util/Alert";
import { IconTrash } from "@tabler/icons-react";
import LazyImage from "../../../common/ImageFallback";


function UserChannel(props) {
  const dispatch = useDispatch();

  const { startDate, endDate } = props;
  const [search, setSearch] = useState();
  const [data, setData] = useState();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const { getUserChannel, totalUserChannel } = useSelector(
    (state) => state.user
  );
  const [showURLs, setShowURLs] = useState([]);

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", UserImage);
    });
  });
  useEffect(() => {
    dispatch(getUserChannels(page, size, startDate, endDate, "realUser"));

    return () => {
      dispatch(cleanUserData())
    };
  }, [dispatch, startDate, endDate, page, size]);

  useEffect(() => {
    setData(getUserChannel);
  }, [getUserChannel]);

  const handleDeleteChanel = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed;
          if (yes) {
            const id = row?.channelId;
            dispatch(deleteChanel(id));
          }
        }
      })
      .catch((err) => console.log(err));
  };


  const channelAllUser = [
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }) => <span className="  text-nowrap">{index + 1}</span>,
    },
    {
      Header: "CHANNEL NAME",
      body: "fullName",
      Cell: ({ row, index }) => (
        <div className="d-flex align-items-center">
          {/* <img src={row?.image ? row?.image : UserImage} width="50px" height="50px" /> */}
          <LazyImage imageSrc={row?.image ? row?.image : UserImage} width="50px" height="50px" />
          <span className="text-capitalize ms-3  cursorPointer text-nowrap">
            {row?.fullName}
          </span>
        </div>
      ),
    },
    {
      Header: "EMAIL",
      body: "email",
      Cell: ({ row }) => (
        <span className="    cursorPointer">{row?.email}</span>
      ),
    },
    {
      Header: "CHANNEL ID",
      body: "channelId",
      Cell: ({ row }) => (
        <span className="text-capitalize  text-nowrap">{row?.channelId}</span>
      ),
    },

    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <button
            className="btn btn-sm"
            onClick={() => handleDeleteChanel(row)}
          >
            <IconTrash className="text-secondary" />
          </button>
        </div>
      ),
    },
  ];
  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  return (
    <div>
      <div className="user-table mb-3">
        <div className="user-table-top">
          <div className=" d-flex justify-content-between w-100 ">
            <div className="w-100">
              <h5
                className=""
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "4px",
                  marginTop: "5px",
                }}
              >
                User Channel Table
              </h5>
            </div>
            <Searching
              placeholder={"Enter Details..."}
              // label={"  Search for ID, Keyword, Channel Name, Email"}
              data={getUserChannel}
              type={"client"}
              setData={setData}
              actionShow={false}
              onFilterData={handleFilterData}
              searchValue={search}
              className={"d-flex justify-content-end w-100"}
            />

          </div>
        </div>
        <Table
          data={data}
          mapData={channelAllUser}
          serverPerPage={size}
          serverPage={page}
          type={"server"}
        />
        <Pagination
          type={"server"}
          activePage={page}
          actionShow={false}
          rowsPerPage={size}
          userTotal={totalUserChannel}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
export default connect(null, {
  getUserChannels,
})(UserChannel);
