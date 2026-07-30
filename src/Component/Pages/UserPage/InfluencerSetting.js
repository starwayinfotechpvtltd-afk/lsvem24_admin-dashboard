import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../extra/Button";
import axios from "axios";
import { setToast } from "../../../util/toast";
import { getUserProfile } from "../../store/user/user.action";

export default function InfluencerSetting(props) {
  const { userProfile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [influencers, setInfluencers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchingInfluencers, setFetchingInfluencers] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showBecomeModal, setShowBecomeModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);

  const [unlockedEmail, setUnlockedEmail] = useState("");
  const [unlockedPhone, setUnlockedPhone] = useState("");

  useEffect(() => {
    if (userProfile) {
      setIsInfluencer(userProfile?.isInfluencer || false);
    }
  }, [userProfile]);

  const fetchInfluencers = async () => {
    try {
      setFetchingInfluencers(true);
      const userId = userProfile?._id || "";
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/user/getInfluencers?userId=${userId}`
      );
      if (res.data.status) {
        const rawList = res.data.influencers || [];
        const filtered = rawList.filter((inf) => inf._id !== userId);
        setInfluencers(filtered);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingInfluencers(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const handleSubscribeInfluencer = async () => {
    const userId = userProfile?._id;
    if (!userId) {
      setToast("error", "User ID not found");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URI}/user/becomeInfluencer?userId=${userId}`
      );
      if (res.data.status) {
        setIsInfluencer(true);
        setShowBecomeModal(false);
        setToast("success", res.data.message || "Congratulations! You are now a verified Influencer with unlimited access.");
        dispatch(getUserProfile(userId));
        fetchInfluencers();
      } else {
        setToast("error", res.data.message || "Failed to update influencer status");
      }
    } catch (error) {
      console.error(error);
      setToast("error", error?.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectInfluencer = async (inf) => {
    setSelectedInfluencer(inf);
    setIsFollowed(false);
    setUnlockedEmail("");
    setUnlockedPhone("");

    const userId = userProfile?._id;
    if (userId && inf?._id) {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/user/checkFollowStatus?userId=${userId}&influencerId=${inf._id}`
        );
        if (res.data.status) {
          setIsFollowed(res.data.isFollowed || false);
          if (res.data.email) setUnlockedEmail(res.data.email);
          if (res.data.mobileNumber) setUnlockedPhone(res.data.mobileNumber);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleConfirmFollow = async () => {
    const userId = userProfile?._id;
    const influencerId = selectedInfluencer?._id;
    if (!userId || !influencerId) {
      setToast("error", "UserId and InfluencerId are required");
      return;
    }

    const currentCoins = userProfile?.coin || 0;
    if (!isFollowed && currentCoins < 100) {
      setToast("error", `To follow this influencer you have to pay 100 coins. You currently have ${currentCoins} coins.`);
      return;
    }

    try {
      setFollowLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/user/followInfluencer`,
        { userId, influencerId }
      );
      if (res.data.status) {
        setIsFollowed(res.data.isFollowed);
        if (res.data.email) setUnlockedEmail(res.data.email);
        if (res.data.mobileNumber) setUnlockedPhone(res.data.mobileNumber);
        setShowFollowModal(false);
        setToast("success", res.data.message);
        dispatch(getUserProfile(userId));
        fetchInfluencers();
      } else {
        setToast("error", res.data.message);
      }
    } catch (err) {
      console.error(err);
      setToast("error", "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const filteredInfluencerList = influencers.filter((inf) => {
    const name = (inf.fullName || inf.nickName || "").toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return !query || name.includes(query);
  });

  return (
    <div className="card1 mt-3 position-relative">
      {/* Header with Top Right Corner Button */}
      <div className="cardHeader p-3 d-flex justify-content-between align-items-center">
        <h5 style={{ fontWeight: "500", fontSize: "20px" }} className="m-0">
          Influencer Directory
        </h5>

        <Button
          btnName={isInfluencer ? "You are already an influencer" : "Become Influencer"}
          newClass={"submit-btn"}
          onClick={() => {
            if (!isInfluencer) setShowBecomeModal(true);
          }}
          disabled={isInfluencer}
          style={{
            borderRadius: "0.5rem",
            backgroundColor: isInfluencer ? "#28a745" : undefined,
            cursor: isInfluencer ? "default" : "pointer",
          }}
        />
      </div>

      {/* Main Influencer Content */}
      <div className="row p-3">
        {/* Main Influencer List */}
        <div className="col-12 col-lg-7 mb-3">
          <div className="p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold m-0">Influencers List</h6>
              <span className="badge bg-light text-dark">{filteredInfluencerList.length} Total</span>
            </div>

            {/* Search Input Field */}
            <div className="mb-3 position-relative">
              <input
                type="text"
                className="form-control pe-4"
                placeholder="Search influencer name automatically..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: "8px" }}
              />
              {searchQuery && (
                <span
                  className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer text-muted"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </span>
              )}
            </div>

            {fetchingInfluencers ? (
              <div className="text-center py-4">Loading influencers...</div>
            ) : filteredInfluencerList.length === 0 ? (
              <div className="text-center py-4 text-muted">
                {searchQuery ? `No matching influencers found for "${searchQuery}"` : "No influencers registered yet. Click 'Become Influencer' above!"}
              </div>
            ) : (
              <div className="list-group">
                {filteredInfluencerList.map((inf) => (
                  <div
                    key={inf._id}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center cursor-pointer p-3 ${
                      selectedInfluencer?._id === inf._id ? "active text-white" : ""
                    }`}
                    onClick={() => handleSelectInfluencer(inf)}
                    style={{ borderRadius: "10px", marginBottom: "8px" }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={inf.image || "https://via.placeholder.com/45"}
                        alt={inf.fullName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/45";
                        }}
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "12px",
                        }}
                      />
                      <div>
                        <h6 className="mb-1 fw-bold">{inf.fullName || inf.nickName || "Influencer"}</h6>
                        <small className={selectedInfluencer?._id === inf._id ? "text-light" : "text-muted"}>
                          {inf.followerCount || 120} followers • {inf.country || "Global"}
                        </small>
                      </div>
                    </div>
                    <span className="badge bg-primary rounded-pill">View Profile →</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inner Influencer Detail View */}
        <div className="col-12 col-lg-5 mb-3">
          <div className="p-3 border rounded h-100 d-flex flex-column justify-content-between">
            {selectedInfluencer ? (
              <div>
                <h6 className="fw-bold mb-3">Influencer Inner Page</h6>
                <div className="text-center mb-3">
                  <img
                    src={selectedInfluencer.image || "https://via.placeholder.com/80"}
                    alt={selectedInfluencer.fullName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80";
                    }}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #7367f0",
                    }}
                  />
                  <h5 className="mt-2 fw-bold mb-0">
                    {selectedInfluencer.fullName || selectedInfluencer.nickName}
                  </h5>
                </div>

                {/* Details Container (Blurred when not followed) */}
                <div className="position-relative">
                  <div
                    style={{
                      filter: isFollowed ? "none" : "blur(7px)",
                      userSelect: isFollowed ? "auto" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div className="p-2 border rounded mb-2 bg-light text-dark small">
                      <strong>Email:</strong> {isFollowed ? (unlockedEmail || selectedInfluencer.email || "creator@domain.com") : "hidden_influencer_email@domain.com"}
                    </div>

                    <div className="p-2 border rounded mb-2 bg-light text-dark small">
                      <strong>Phone Number:</strong> {isFollowed ? (unlockedPhone || selectedInfluencer.mobileNumber || "+91 98765 43210") : "+91 ***** *****"}
                    </div>

                    <div className="p-2 border rounded mb-3 bg-light text-dark small">
                      <strong>Description:</strong>
                      <p className="mb-0 mt-1">
                        {selectedInfluencer.descriptionOfChannel ||
                          "Official verified influencer profile."}
                      </p>
                    </div>
                  </div>

                  {!isFollowed && (
                    <div
                      className="position-absolute top-50 start-50 translate-middle text-center p-3 rounded shadow"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.92)",
                        border: "1.5px solid #ff9f43",
                        width: "85%",
                      }}
                    >
                      <i className="fa-solid fa-lock text-warning fs-3 mb-1"></i>
                      <h6 className="fw-bold mb-1 text-dark">Locked Profile Details</h6>
                      <small className="text-muted d-block">
                        Pay 100 coins to follow & view full email and phone number.
                      </small>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-around text-center mb-3 mt-2">
                  <div>
                    <h6 className="mb-0 fw-bold">{selectedInfluencer.followerCount || 120}</h6>
                    <small className="text-muted">Followers</small>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{selectedInfluencer.country || "Global"}</h6>
                    <small className="text-muted">Country</small>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <i className="fa-solid fa-user-check fs-1 mb-2"></i>
                <p>Click an influencer from the list to view their inner profile page.</p>
              </div>
            )}

            {/* Bottom Button: "Follow Influencer" */}
            {selectedInfluencer && (
              <div className="pt-3 border-top text-center">
                <Button
                  btnName={
                    followLoading
                      ? "Processing..."
                      : isFollowed
                      ? "Following Influencer"
                      : "Follow Influencer"
                  }
                  newClass={"submit-btn w-100"}
                  onClick={() => {
                    if (!isFollowed) {
                      setShowFollowModal(true);
                    }
                  }}
                  disabled={followLoading || isFollowed}
                  style={{
                    borderRadius: "0.5rem",
                    padding: "10px",
                    fontWeight: "bold",
                    backgroundColor: isFollowed ? "#28a745" : undefined,
                    cursor: isFollowed ? "default" : "pointer",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Follow Confirmation Popup Modal */}
      {showFollowModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-header-title text-white m-0 fw-bold">Follow Influencer</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowFollowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <div className="mb-3">
                  <i className="fa-solid fa-coins fs-1 text-warning"></i>
                </div>
                <h6 className="fw-bold mb-2">
                  To follow this influencer you have to pay 100 coins.
                </h6>
                <p className="small text-muted mb-3">
                  Following will deduct 100 coins and clearly display full profile details including Email & Phone Number.
                </p>
                <div className="p-2 border rounded bg-light text-dark small mb-2 fw-bold">
                  Your Current Balance: {userProfile?.coin || 0} Coins
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary px-4 me-2"
                  onClick={() => setShowFollowModal(false)}
                >
                  Cancel
                </button>
                <Button
                  btnName={followLoading ? "Processing..." : "Follow"}
                  newClass={"submit-btn px-4"}
                  onClick={handleConfirmFollow}
                  disabled={followLoading}
                  style={{ borderRadius: "0.5rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Become Influencer Modal */}
      {showBecomeModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-header-title text-white m-0 fw-bold">Become Influencer</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowBecomeModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-success text-dark border-success mb-3">
                  <h6 className="fw-bold mb-1">🎉 100% Free & Unlimited Duration</h6>
                  <p className="mb-0 small">
                    You can become a verified Influencer right now without paying any coins! Access is unlimited.
                  </p>
                </div>

                <h6 className="fw-bold mb-2">🌟 Benefits of Becoming an Influencer:</h6>
                <ul className="mb-3 small">
                  <li className="mb-1"><strong>Verified Badge:</strong> Display gold influencer tick on channel & videos.</li>
                  <li className="mb-1"><strong>3x Algorithm Boost:</strong> Recommended on home feed & trending list.</li>
                  <li className="mb-1"><strong>Higher Monetization:</strong> Earn bonus rewards per watch hour.</li>
                  <li className="mb-1"><strong>Featured Directory:</strong> Prominently listed in Influencer Directory.</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBecomeModal(false)}
                >
                  Cancel
                </button>
                <Button
                  btnName={loading ? "Processing..." : "Become Influencer"}
                  newClass={"submit-btn"}
                  onClick={handleSubscribeInfluencer}
                  disabled={loading}
                  style={{ borderRadius: "0.5rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
