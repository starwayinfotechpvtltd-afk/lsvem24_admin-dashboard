import React, { useEffect, useState } from "react";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import Searching from "../../extra/Searching";
import { connect, useDispatch, useSelector } from "react-redux";
import { getAdsApi, deleteAd, toggleAdStatus, toggleAdVerification } from "../../store/ads/ads.action";
import { warning } from "../../../util/Alert";
import UserImage from "../../../assets/images/8.jpg";
import $ from "jquery";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import { useNavigate } from "react-router-dom";
import { IconEdit, IconPlayerPlayFilled, IconTrash } from "@tabler/icons-react";
import LazyImage from "../../../common/ImageFallback";
import HandleVideo from "../../../common/HandleVideo";
import ShowVideo from "../../dialogue/ShowVideo";
import ToggleSwitch from "../../extra/ToggleSwitch";

function ManageVideo(props) {
  const { startDate, endDate, multiButtonSelectData } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkBox, setCheckBox] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [verificationRequests, setVerificationRequests] = useState();
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState();
  const [data, setData] = useState([]);
  const [showURLs, setShowURLs] = useState([]);
  const [showVideoURLs, setShowVideoURLs] = useState([]);
  const [expandedTitle, setExpandedTitle] = useState({});

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [show, setShow] = useState(false);
  const [url, setUrl] = useState();
  const [isImageModal, setIsImageModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Ad Preview");

  const toggleReview = (index) => {
    setExpandedTitle((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const { adsData, totalVideo } = useSelector((state) => state.ads);
  console.log(adsData)

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", UserImage);
    });
  });

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
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

  const paginationSubmitButton = () => {

    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    if (actionPagination === "delete" && selectCheckDataGetId?.length > 0) {
      const data = warning();
      data
        .then((res) => {
          if (res) {
            if (res) {
              props.deleteAd(selectCheckDataGetId);
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
          const yes = res.isConfirmed;
          if (yes) {
            const id = row?._id;
            props.deleteAd(id);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (data) {
      fetchData();
    }
  }, [data]);

  const fetchData = () => {
    if (!data || data.length === 0) {
      return;
    }

    const urls = data?.map((item) => {
      const fileNameWithExtension = item?.image;
      return fileNameWithExtension;
    });
    setShowURLs(urls);
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

  const handleClose = () => {
    setShow(false);
    setUrl("");
    setIsImageModal(false);
  };

  const handleOpenMedia = (mediaUrl, isImg, mediaTitle) => {
    setUrl(mediaUrl);
    setIsImageModal(isImg);
    setModalTitle(mediaTitle || (isImg ? "Ad Image" : "Ad Video"));
    setShow(true);
  };

  const videoMapData = [
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
      Header: "ADS",
      body: "video",
      Cell: ({ row }) => {
        const hasVideo = Boolean(row?.video || row?.videoUrl);
        const hasImage = Boolean(row?.image || row?.videoImage);
        const mediaUrl = (row?.video || row?.videoUrl) || (row?.image || row?.videoImage);
        const isImg = !hasVideo && hasImage;
        const thumbnailSrc = row?.image || row?.videoImage || row?.video || row?.videoUrl;

        return (
          <div className="d-flex justify-content-center">
            <div
              style={{
                position: "relative",
                width: "50px",
                height: "50px",
                cursor: mediaUrl ? "pointer" : "default",
              }}
              onClick={() => {
                if (mediaUrl) {
                  handleOpenMedia(mediaUrl, isImg, hasVideo ? "Ad Video" : "Ad Image");
                }
              }}
            >
              {hasVideo && (
                <IconPlayerPlayFilled
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                    fontSize: "20px",
                    color: "white",
                  }}
                />
              )}
              <LazyImage
                imageSrc={thumbnailSrc}
                width="50px"
                height="50px"
                style={{ filter: hasVideo ? "brightness(0.6)" : "none" }}
              />
            </div>
          </div>
        );
      },
    },
    {
      Header: "USER",
      body: "addedBy",
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <LazyImage
            imageSrc={row?.userId?.image}
            width="40px"
            height="40px"
            style={{ borderRadius: "50%" }}
          />
          <span className="text-capitalize ms-3 cursorPointer text-nowrap">
            {row?.userId?.fullName || row?.fullName || "Admin"}
          </span>
        </div>
      ),
    },
    {
      Header: "USER ID",
      body: "uniqueId",
      Cell: ({ row }) => (
        <span className="cursorPointer">
          {row?.userId?.uniqueId || row?.uniqueId || "-"}
        </span>
      ),
    },
    {
      Header: "ADS ID",
      body: "uniqueVideoId",
      Cell: ({ row }) => (
        <span className="cursorPointer">
          {row?.uniqueAdsId || row?.uniqueVideoId || row?._id}
        </span>
      ),
    },
    {
      Header: "TITLE",
      Cell: ({ row, index }) => {
        const isExpanded = expandedTitle[index];
        const titleText = row?.title;
        const previewText = titleText?.substring(0, 30);

        return (
          <span className="text-capitalize">
            {isExpanded ? titleText : previewText}
            {titleText.length > 30 && (
              <span
                onClick={() => toggleReview(index)}
                className="read-more text-danger bg-none ps-2"
              >
                {isExpanded ? "Read less" : "Read more..."}
              </span>
            )}
          </span>
        );
      },
    },
    {
      Header: "VERIFIED",
      body: "isVerified",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isVerified}
          onClick={() => props.toggleAdVerification(row?._id)}
        />
      ),
    },
    {
      Header: "ACTIVE",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onClick={() => props.toggleAdStatus(row?._id)}
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
            onClick={() => handleEdit(row, "editVideo")}
          />
          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteVideo(row)}
          /> */}

          <button
            className="btn btn-sm"
            onClick={() => handleEdit(row, "editVideo")}
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
    setData(adsData);
  }, [adsData]);

  useEffect(() => {
    // const timer = setTimeout(() => {
    dispatch(getAdsApi(1, page, size, startDate, endDate));
    // }, 2000); // 2000 ms = 2 seconds

    // Cleanup to avoid memory leaks on unmount or dependency change
    // return () => clearTimeout(timer);
  }, [dispatch, startDate, endDate, page, size]);

  return (
    <div>
      <ShowVideo
        title={modalTitle}
        show={show}
        url={url}
        isImage={isImageModal}
        handleClose={handleClose}
      />
      <div className="user-table mb-3">
        <div className="user-table-top">
          <div className="d-flex justify-content-between w-100">
            <div className="w-100">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "4px",
                  marginTop: "5px",
                }}
              >
                Manage & Edit Ads
              </h5>
            </div>
            <Searching
              label={" Search for ID, Keyword, Title, Username"}
              placeholder={"Search..."}
              data={adsData}
              type={"client"}
              setData={setData}
              onFilterData={handleFilterData}
              searchValue={search}
              customSelectDataShow={true}
              customSelectData={["Delete"]}
              actionPagination={actionPagination}
              setActionPagination={setActionPagination}
              paginationSubmitButton={paginationSubmitButton}
              className={"d-flex justify-content-end w-100"}
            />
          </div>
        </div>
        <Table
          data={data}
          mapData={videoMapData}
          serverPerPage={size}
          serverPage={page}
          handleSelectAll={handleSelectAll}
          selectAllChecked={selectAllChecked}
          type={"server"}
        />
        <div className="mt-3">
          <Pagination
            type={"server"}
            activePage={page}
            rowsPerPage={size}
            userTotal={totalVideo}
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
  getAdsApi,
  deleteAd,
  toggleAdStatus,
  toggleAdVerification,
})(ManageVideo);
