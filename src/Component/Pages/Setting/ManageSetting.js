import React, { useState } from "react";
import NewTitle from "../../extra/Title";
import AppSetting from "./AppSetting";
import PaymentSetting from "./PaymentSetting";
import PaymentGatewaySetting from "./PaymentGatewaySetting";
import MonetizationSetting from "./MonetizationSetting";
import StorageSettingPage from "./StorageSettingPage";

const ManageSetting = () => {
  const [multiButtonSelect, setMultiButtonSelect] = useState("Setting");

  return (
    <div className="userPage">
      <div>
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={false}
            // titleShow={true}
            setMultiButtonSelect={setMultiButtonSelect}
            multiButtonSelect={multiButtonSelect}
            // name={`Setting`}/
            labelData={[
              "Setting",
              "Storage Setting",
              "Payment Setting",
              "Monetize & Ads Setting",
              "Withdraw Setting",
            ]}
          />
        </div>
        <div>
          {multiButtonSelect === "Setting" && (
            <AppSetting multiButtonSelectNavigate={setMultiButtonSelect} />
          )}

          {multiButtonSelect === "Payment Setting" && <PaymentSetting />}

          {multiButtonSelect === "Withdraw Setting" && (
            <PaymentGatewaySetting />
          )}

          {multiButtonSelect === "Monetize & Ads Setting" && (
            <MonetizationSetting />
          )}
          {multiButtonSelect === "Storage Setting" && (
            <StorageSettingPage />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSetting;
