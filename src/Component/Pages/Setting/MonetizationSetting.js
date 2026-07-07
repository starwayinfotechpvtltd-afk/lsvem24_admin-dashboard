import React, { useEffect, useMemo, useState } from "react";
import Input from "../../extra/Input";
import {
  getSettingApi,
  editSetting,
  switchApi,
  getAdsApi,
  isAdsChange,
  adsApiData,
  getWithdrawalApi,
} from "../../store/setting/setting.action";
import { FormControlLabel, Switch } from "@mui/material";
import styled from "@emotion/styled";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../extra/Button";
import { permissionError } from "../../../util/Alert";
import { getDefaultCurrency } from "../../store/currency/currency.action";

/* Styled switch (correct mode check) */
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 76,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    top: 8,
    transform: "translateX(10px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(38px)",
      top: 8,
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.5992 5.06724C16.396 4.86409 16.1205 4.75 15.8332 4.75c-.2872 0-.5627.11409-.7659.31719L7.9166 12.2179 4.934 9.2353a1.17 1.17 0 0 0-1.7801 1.532l3.7486 3.7486c.2031.2031.4786.3172.7659.3172s.5627-.1141.7659-.3172l7.9167-7.9167c.2031-.20315.3172-.47865.3172-.76591 0-.28727-.1141-.56277-.3172-.76592Z" fill="white" stroke="white" stroke-width="0.5"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor:
          theme?.palette?.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme?.palette?.mode === "dark" ? "#0FB515" : "red",
    width: 24,
    height: 24,
    "&:before": {
      content: "''",
      position: "absolute",
      inset: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.1665 5.83301 5.83325 14.1663" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M5.83325 5.83301 14.1665 14.1663" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    border: "0.5px solid rgba(0,0,0,0.14)",
    background: "#FFEDF0",
    boxShadow: "inset 0 0 2px rgba(0,0,0,0.08)",
    opacity: 1,
    width: 60,
    height: 28,
    borderRadius: 52,
  },
}));

const MonetizationSetting = (props) => {
  const dispatch = useDispatch();
  const { settingData, adsData } = useSelector((s) => s.setting);
  const { defaultCurrency } = useSelector((s) => s.currency);
  const hasPermission = useSelector((s) => s.admin.admin.flag);
  const isDemo = sessionStorage.getItem("demo") === "demo@admin.com";

  /* Monetize state */
  const [data, setData] = useState(null);
  const [isMonetization, setIsMonetization] = useState(false);
  const [minWatchTime, setMinWatchTime] = useState(0);
  const [minSubScriber, setMinSubScriber] = useState(0);
  const [earningPerHour, setEarningPerHour] = useState(0);
  const [adDisplayIndex, setAdDisplayIndex] = useState(1);

  /* Ads state (Android) */
  const [androidGoogleInterstitial, setAndroidGoogleInterstitial] = useState("");
  const [androidGoogleNative, setAndroidGoogleNative] = useState("");
  const [androidGoogleNativeVideo, setAndroidGoogleNativeVideo] = useState("");
  const [androidGoogleReward, setAndroidGoogleReward] = useState("");
  const [androidVideoAdUrl, setAndroidVideoAdUrl] = useState(""); // NEW (flat submit)

  /* Ads state (iOS) */
  const [iosGoogleInterstitial, setIosGoogleInterstitial] = useState("");
  const [iosGoogleNative, setIosGoogleNative] = useState("");
  const [iosGoogleNativeVideo, setIosGoogleNativeVideo] = useState("");
  const [iosGoogleReward, setIosGoogleReward] = useState("");
  const [iosVideoAdUrl, setIosVideoAdUrl] = useState(""); // NEW (flat submit)

  const [googleAds, setGoogleAds] = useState(false);

  const [error, setError] = useState({
    minWatchTime: "",
    minSubScriber: "",
    earningPerHour: "",
  });

  /* Bootstrap */
  useEffect(() => {
    if (isDemo) return;
    dispatch(getSettingApi());
    dispatch(getDefaultCurrency());
    dispatch(getAdsApi());
  }, [dispatch, isDemo]);

  /* Store → local (Monetize) */
  useEffect(() => {
    if (!settingData) return;
    setData(settingData);
    setIsMonetization(Boolean(settingData?.isMonetization));
    setMinWatchTime(Number(settingData?.minWatchTime || 0));
    setMinSubScriber(Number(settingData?.minSubScriber || 0));
    setEarningPerHour(Number(settingData?.earningPerHour || 0));
    setAdDisplayIndex(
      Number.isFinite(Number(settingData?.adDisplayIndex))
        ? Number(settingData?.adDisplayIndex)
        : 1
    );
  }, [settingData]);

  /* Store → local (Ads, read nested, keep flat state) */
  useEffect(() => {
    if (!adsData) return;

    setAndroidGoogleInterstitial(adsData?.android?.google?.interstitial || "");
    setAndroidGoogleNative(adsData?.android?.google?.native || "");
    setAndroidGoogleNativeVideo(adsData?.android?.google?.nativeAdVideo || "");
    setAndroidGoogleReward(adsData?.android?.google?.reward || "");
    setAndroidVideoAdUrl(adsData?.android?.google?.videoAdUrl || ""); // NEW

    setIosGoogleInterstitial(adsData?.ios?.google?.interstitial || "");
    setIosGoogleNative(adsData?.ios?.google?.native || "");
    setIosGoogleNativeVideo(adsData?.ios?.google?.nativeAdVideo || "");
    setIosGoogleReward(adsData?.ios?.google?.reward || "");
    setIosVideoAdUrl(adsData?.ios?.google?.videoAdUrl || ""); // NEW
    

    setGoogleAds(Boolean(adsData?.isGoogle));
  }, [adsData]);

  /* Helpers */
  const guardPermission = async () => {
    if (!hasPermission) {
      await permissionError();
      return false;
    }
    return true;
  };

  const validateMonetizeForm = () => {
    const errs = {};
    if (!Number.isFinite(minWatchTime) || minWatchTime <= 0)
      errs.minWatchTime = "Min Watch Time must be > 0.";
    if (!Number.isFinite(minSubScriber) || minSubScriber < 0)
      errs.minSubScriber = "Min Subscriber must be ≥ 0.";
    if (!Number.isFinite(earningPerHour) || earningPerHour < 0)
      errs.earningPerHour = "Earning per hour must be ≥ 0.";
    setError((prev) => ({ ...prev, ...errs }));
    return Object.keys(errs).length === 0;
  };

  /* Handlers */
  const handleSubmit = async () => {
    if (!(await guardPermission())) return;
    if (!validateMonetizeForm()) return;

    const payload = {
      minWatchTime: Number(minWatchTime),
      minSubScriber: Number(minSubScriber),
      adDisplayIndex: Math.max(1, Number(adDisplayIndex) || 1),
      earningPerHour: Number(earningPerHour),
    };
    props.editSetting(data?._id, payload);
  };

  // ⬇️ Keep FLAT payload keys exactly like you used before, just add androidVideoAdUrl/iosVideoAdUrl
  const handleSubmitAds = async () => {
    if (!(await guardPermission())) return;

    const adsDataApi = {
      androidGoogleInterstitial,
      androidGoogleNative,
      androidNativeAdVideo: androidGoogleNativeVideo,
      iosNativeAdVideo: iosGoogleNativeVideo,
      iosGoogleNative,
      iosGoogleInterstitial,
      androidGoogleReward,
      iosGoogleReward,

      // NEW flat fields (server maps to nested videoAdUrl)
      androidGoogleVideoAdUrl: androidVideoAdUrl,
  iosGoogleVideoAdUrl: iosVideoAdUrl,
    };

    dispatch(adsApiData(adsDataApi, adsData?._id));
  };

  const handleChangeSwitch = async (method) => {
    if (!(await guardPermission())) return;
    try {
      if (method === "monetization") {
        const next = !isMonetization;
        setIsMonetization(next);
        await props.switchApi(data?._id, method, next); // send NEW value
      }
    } catch (e) {
      console.error("Error updating switch:", e);
    }
  };

  const handleChangeAds = async () => {
    if (!(await guardPermission())) return;
    const next = !googleAds;
    setGoogleAds(next);
    dispatch(isAdsChange(next, adsData?._id)); // pass desired next state
  };

  const currencySymbol = useMemo(
    () => (defaultCurrency?.symbol ? defaultCurrency.symbol : ""),
    [defaultCurrency?.symbol]
  );

  return (
    <div className="payment-setting p-0">
      {/* ===== Monetize Setting ===== */}
      <div className="card1">
        <div className="cardHeader p-3">
          <div className="row">
            <div className="col-6 d-flex align-items-center">
              <h5 className="mb-0 d-flex align-items-center">Monetize Setting</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <Button
                btnName={"Submit"}
                type={"button"}
                onClick={handleSubmit}
                newClass={"submit-btn"}
                style={{ borderRadius: "0.5rem", width: 88, marginLeft: 10 }}
              />
            </div>
          </div>
        </div>

        <div className="row p-3">
          <div className="col-lg-6 col-sm-12">
            <div className="mb-4">
              <div className="withdrawal-box ">
                <div className="row">
                  <div className="col-12 d-flex justify-content-between align-items-center ">
                    <p className="m-0 fw-medium">
                      <span>Monetization Switch (enable/disable monetization in app)</span>
                    </p>
                    <FormControlLabel
                      control={
                        <MaterialUISwitch
                          sx={{ m: 1 }}
                          checked={Boolean(isMonetization)}
                          onChange={() => handleChangeSwitch("monetization")}
                        />
                      }
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"Min Watch Time of hours of Viewership in channel Required for Monetization"}
                      name={"minWatchTime"}
                      type={"number"}
                      value={minWatchTime}
                      errorMessage={error.minWatchTime}
                      placeholder={isDemo ? "1500" : "Enter Detail..."}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setMinWatchTime(Number.isFinite(v) ? v : 0);
                        setError((prev) => ({ ...prev, minWatchTime: "" }));
                      }}
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"Minimum Subscriber Count for Monetization Eligibility"}
                      name={"minSubScriber"}
                      type={"number"}
                      value={minSubScriber}
                      errorMessage={error.minSubScriber}
                      placeholder={isDemo ? "1000" : "Enter Detail..."}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setMinSubScriber(Number.isFinite(v) ? v : 0);
                        setError((prev) => ({ ...prev, minSubScriber: "" }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="col-lg-6 col-sm-12">
            <div className="mb-4">
              <div className="withdrawal-box ">
                <h6>Set Earnings Rate Per Hour Of Viewership For Creator</h6>
                <div className="row withdrawal-input">
                  <div className="row">
                    <div className="col-5">
                      <Input label={"Hour"} name={"Hour"} type={"number"} value={1} disabled />
                    </div>
                    <div className="col-1" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p className="mb-0 mt-4" style={{ fontSize: 22 }}>=</p>
                    </div>
                    <div className="col-6">
                      <Input
                        label={`Earning (${currencySymbol})`}
                        name={"earningPerHour"}
                        type={"number"}
                        value={earningPerHour}
                        errorMessage={error.earningPerHour}
                        placeholder={isDemo ? "3.25" : "Enter Detail..."}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setEarningPerHour(Number.isFinite(v) ? v : 0);
                          setError((prev) => ({ ...prev, earningPerHour: "" }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ad frequency */}
          <div className="col-12">
            <div className="mb-4">
              <div className="withdrawal-box ">
                <h6>Show Ads After Every {Math.max(1, Number(adDisplayIndex) || 1)} Video Views</h6>
                <div className="row withdrawal-input">
                  <div className="row">
                    <div className="col-12">
                      <Input
                        label={"Ad Display Frequency (Number of Videos)"}
                        name={"adDisplayIndex"}
                        type={"number"}
                        value={adDisplayIndex}
                        placeholder={isDemo ? "2" : "Enter Detail..."}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setAdDisplayIndex(Number.isFinite(v) ? v : 1);
                        }}
                      />
                    </div>
                    <div className="col-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* /card1 Monetize */}

      {/* ===== Ads Setting ===== */}
      <div className="card1">
        <div className="cardHeader p-3">
          <div className="row">
            <div className="col-6 d-flex align-items-center">
              <h5 className="mb-0 d-flex align-items-center">Ads Setting</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <Button
                btnName={"Submit"}
                type={"button"}
                onClick={handleSubmitAds}
                newClass={"submit-btn"}
                style={{ borderRadius: "0.5rem", width: 88, marginLeft: 10 }}
              />
            </div>
          </div>
        </div>

        <div className="cardBody p-3">
          <div className="row ">
            <div className="col-12 col-lg-6">
              <div className="mb-4">
                <div className="withdrawal-box ">
                  <div className="row">
                    <div className="col-12 d-flex justify-content-between align-items-center ">
                      <p className="fw-medium m-0">
                        <span>Google Ad (enable/disable google ads in app)</span>
                      </p>
                      <FormControlLabel
                        control={
                          <MaterialUISwitch
                            sx={{ m: 1 }}
                            checked={Boolean(googleAds)}
                            onChange={handleChangeAds}
                          />
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Android / iOS fields */}
          <div className="row">
            {/* Android */}
            <div className="col-md-6">
              <div className="">
                <div className="withdrawal-box ">
                  <h6>Android</h6>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"Android Google Interstitial"}
                      name={"androidGoogleInterstitial"}
                      type={"text"}
                      value={androidGoogleInterstitial}
                      placeholder={isDemo ? "ca-app-pub-3940256099942544/1033173712" : "Enter Detail..."}
                      onChange={(e) => setAndroidGoogleInterstitial(e.target.value)}
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"Android Google Native Image Ad"}
                      name={"androidGoogleNative"}
                      type={"text"}
                      value={androidGoogleNative}
                      placeholder={isDemo ? "ca-app-pub-3940256099942544/2247696110" : "Enter Detail..."}
                      onChange={(e) => setAndroidGoogleNative(e.target.value)}
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"Android Google Native Video Ad"}
                      name={"androidGoogleNativeVideo"}
                      type={"text"}
                      value={androidGoogleNativeVideo}
                      placeholder={isDemo ? "ca-app-pub-3940256099942544/2247696110" : "Enter Detail..."}
                      onChange={(e) => setAndroidGoogleNativeVideo(e.target.value)}
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"Android Google Reward"}
                      name={"androidGoogleReward"}
                      type={"text"}
                      value={androidGoogleReward}
                      placeholder={isDemo ? "ca-app-pub-3940256099942544/5224354917" : "Enter Detail..."}
                      onChange={(e) => setAndroidGoogleReward(e.target.value)}
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"Android Interactive Video Ad URL"}
                      name={"androidVideoAdUrl"}
                      type={"text"}
                      value={androidVideoAdUrl}
                      placeholder={isDemo ? "android_video_ad_url_id" : "Enter Detail..."}
                      onChange={(e) => setAndroidVideoAdUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* iOS */}
            <div className="col-md-6">
              <div className="mb-4">
                <div className="withdrawal-box ">
                  <h6>iOS</h6>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"iOS Google Interstitial"}
                      name={"iosGoogleInterstitial"}
                      type={"text"}
                      value={iosGoogleInterstitial}
                      placeholder={isDemo ? "ca-app-pub-3940256099942544/4411468910" : "Enter Detail..."}
                      onChange={(e) => setIosGoogleInterstitial(e.target.value)}
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"iOS Google Native Image Ad"}
                      name={"iosGoogleNative"}
                      type={"text"}
                      value={iosGoogleNative}
                      placeholder={isDemo ? "ca-app-pub-3940256099942544/3986624511" : "Enter Detail..."}
                      onChange={(e) => setIosGoogleNative(e.target.value)}
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"iOS Google Native Video Ad"}
                      name={"iosGoogleNativeVideo"}
                      type={"text"}
                      value={iosGoogleNativeVideo}
                      placeholder={isDemo ? "ca-app-pub-3940256099942544/3986624511" : "Enter Detail..."}
                      onChange={(e) => setIosGoogleNativeVideo(e.target.value)}
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"iOS Google Reward"}
                      name={"iosGoogleReward"}
                      type={"text"}
                      value={iosGoogleReward}
                      placeholder={isDemo ? "ca-app-pub-3940256099942544/1712485313" : "Enter Detail..."}
                      onChange={(e) => setIosGoogleReward(e.target.value)}
                    />
                  </div>

                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={"iOS Interactive Video Ad URL"}
                      name={"iosVideoAdUrl"}
                      type={"text"}
                      value={iosVideoAdUrl}
                      placeholder={isDemo ? "ios_video_ad_url_id" : "Enter Detail..."}
                      onChange={(e) => setIosVideoAdUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>{/* /row */}
        </div>
      </div>{/* /card1 Ads */}
    </div>
  );
};

export default connect(null, {
  getSettingApi,
  editSetting,
  switchApi,
  getAdsApi,
  getWithdrawalApi,
})(MonetizationSetting);
