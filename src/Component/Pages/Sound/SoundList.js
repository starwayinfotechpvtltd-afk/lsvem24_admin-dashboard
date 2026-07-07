import React, { useEffect, useState } from "react";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import Searching from "../../extra/Searching";
import { connect, useDispatch, useSelector } from "react-redux";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import noImageFound from "../../../assets/images/noimage.png";
import { getSoundList, deleteSound } from "../../store/sound/sound.action";
import { warning } from "../../../util/Alert";
import AddIcon from "@mui/icons-material/Add";
import UserImage from "../../../assets/images/8.jpg";
import $ from "jquery";
import SoundAdd from "../../dialogue/SoundAdd";
import ReactAudioPlayer from "react-audio-player";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import LazyImage from "../../../common/ImageFallback";

function SoundList(props) {
  const { startDate, endDate, multiButtonSelectData } = props;
  const dispatch = useDispatch();
  const [checkBox, setCheckBox] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [verificationRequests, setVerificationRequests] = useState();
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState();
  const [data, setData] = useState([]);

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const { soundListData } = useSelector((state) => state.sound);
  console.log("soundListData", soundListData);


  // $(document).ready(function () {
  //   $("img").bind("error", function () {
  //     // Set the default image
  //     $(this).attr("src", noImageFound);
  //   });
  // });
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

  const paginationSubmitButton = () => {

    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    if (actionPagination === "delete" && selectCheckDataGetId?.length > 0) {
      const data = warning();
      data
        .then((res) => {
          if (res) {
            const yes = res.isConfirmed
            if (yes) {
              props.deleteSound(selectCheckDataGetId);
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDeleteVideo = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed
          if (yes) {
            const id = row?._id;
            props.deleteSound(id);
          }
        }
      })
      .catch((err) => console.log(err));
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

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
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

  const soundListMapData = [
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
        <span className="  text-nowrap">{(page - 1) * size + index + 1}</span>
      ),
    },
    {
      Header: "IMAGE",
      body: "soundImage",
      Cell: ({ row }) => (
        // <img
        //   src={row?.soundImage || noImageFound}
        //   alt="sound"
        //   width="50px"
        //   height="50px"
        //   onError={(e) => (e.target.src = noImageFound)}
        // />
        <div className="d-flex justify-content-center">
          <LazyImage imageSrc={row?.soundImage} width="50px" height="50px" />
        </div>
      ),
    },

    {
      Header: "SINGER NAME",
      body: "singerName",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.singerName}</span>
      ),
    },
    {
      Header: "SOUND CATEGORY",
      body: "soundCategory",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.soundCategoryId?.name}</span>
      ),
    },
    {
      Header: "SOUND TITLE",
      body: "soundTitle",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.soundTitle}</span>
      ),
    },
    {
      Header: "SOUND",
      body: "soundLink",
      Cell: ({ row }) => (
        <ReactAudioPlayer
          src={row?.soundLink}
          controls
          muted
          onError={(error) => console.error("Audio error:", error)}
        />
      ),
    },


    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          {/* <Button
            btnIcon={<EditIcon />}
            onClick={() => handleEdit(row, "addCategory")}
          />
          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteVideo(row)}
          /> */}

          <button
            className="btn btn-sm"
            onClick={() => handleEdit(row, "addCategory")}
          >
            <IconEdit className="text-secondary" />
          </button>
          <button className="btn btn-sm" onClick={() => handleDeleteVideo(row)}>
            <IconTrash className="text-secondary" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getSoundList());
  }, [dispatch]);

  useEffect(() => {
    setData(soundListData);
  }, [soundListData]);

  return (
    <div>
      <div className="user-table mb-3">
        {dialogueType == "addCategory" && <SoundAdd />}
        <div className="user-table-top">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="w-100">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginTop: "5px",
                  marginBottom: "4px",
                }}
              >
                Sound List
              </h5>
            </div>
            {/* <div
              className="col-6 new-fake-btn d-flex justify-content-end"
              style={{ marginTop: "5px" }}
            >
              <Button
                btnIcon={<AddIcon />}
                btnName={"New"}
                newClass={"rounded"}
                onClick={() => handleOpenNew("addCategory")}
              />
            </div> */}
            <div className="d-flex justify-content-end w-100">

              <Searching
                placeholder={"Search..."}
                data={soundListData}
                label={" Search for Keyword, Singer Name, Sound Category"}
                type={"client"}
                setData={setData}
                onFilterData={handleFilterData}
                searchValue={search}
                customSelectDataShow={true}
                customSelectData={["Delete"]}
                actionPagination={actionPagination}
                setActionPagination={setActionPagination}
                paginationSubmitButton={paginationSubmitButton}
                className={"d-flex justify-content-end"}
              />

              <Button
                btnIcon={<IconPlus width={18} height={18} />}
                btnName={"New"}
                newClass={"ms-3"}

                onClick={() => handleOpenNew("addCategory")}
              />
            </div>

          </div>
        </div>
        <Table
          data={data}
          mapData={soundListMapData}
          PerPage={size}
          Page={page}
          handleSelectAll={handleSelectAll}
          selectAllChecked={selectAllChecked}
          type={"client"}
        />
        {/* <div className="mt-3">
          <Pagination
            type={"client"}
            activePage={page}
            rowsPerPage={size}
            userTotal={soundListData?.length}
            setPage={setPage}
            setData={setData}
            data={data}
          />
        </div> */}
      </div>
    </div>
  );
}
export default connect(null, {
  getSoundList,
  deleteSound,
})(SoundList);
