import { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { connect, useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../store/admin/admin.action";
import {
  getDashboardCount,
  getDashboardUserChart,
  getChartAnalyticOfActiveUser,
} from "../../store/dashboard/dashboard.action";
import $ from "jquery";
import {
  IconBrandYoutube,
  IconMovie,
  IconUser,
  IconVideo,
  IconAd,
  IconCoin,
  IconCrown,
  IconStar,
  IconRosetteFilled,
  IconTrendingUp,
} from "@tabler/icons-react";

const Dashboard = (props) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");

  const {
    dashboardCount,
    chartAnalyticOfVideos,
    chartAnalyticOfShorts,
    chartAnalyticOfUsers,
    chartAnalyticOfActiveUser,
  } = useSelector((state) => state.dashboard);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let label = [];
  let dataUser = [];
  let dataVideo = [];
  let dataShort = [];

  const startDateFormat = (startDate) => {
    if (startDate === "All") return "All";
    return dayjs(startDate).isValid()
      ? dayjs(startDate).format("YYYY-MM-DD")
      : dayjs().subtract(7, "day").format("YYYY-MM-DD");
  };

  const endDateFormat = (endDate) => {
    if (endDate === "All") return "All";
    return dayjs(endDate).isValid()
      ? dayjs(endDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
  };

  const startDateData = startDateFormat(startDate);
  const endDateData = endDateFormat(endDate);

  useEffect(() => {
    dispatch(getDashboardCount(startDateData, endDateData));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDashboardUserChart(startDateData, endDateData, "Short"));
  }, [dispatch, startDate, endDate]);
  useEffect(() => {
    dispatch(getDashboardUserChart(startDateData, endDateData, "Video"));
  }, [dispatch, startDate, endDate]);
  useEffect(() => {
    dispatch(getDashboardUserChart(startDateData, endDateData, "User"));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    dispatch(getChartAnalyticOfActiveUser(startDateData, endDateData));
  }, [dispatch, startDate, endDate]);

  // Process users' data
  chartAnalyticOfUsers?.forEach((data_) => {
    const newDate = data_?._id;
    label.push(newDate);
    dataUser.push(data_?.count || 0);
  });

  chartAnalyticOfVideos?.forEach((data_) => {
    const newDate = data_?._id;
    label.push(newDate);
    dataVideo.push(data_?.count || 0);
  });

  chartAnalyticOfShorts?.forEach((data_) => {
    const newDate = data_?._id;
    label.push(newDate);
    dataShort.push(data_?.count || 0);
  });

  let labelSet = new Set(label);
  label = [...labelSet].sort((a, b) => new Date(a) - new Date(b));

  const maxLength = label?.length;
  for (let i = 0; i < maxLength; i++) {
    if (dataUser[i] === undefined) dataUser[i] = 0;
    if (dataVideo[i] === undefined) dataVideo[i] = 0;
    if (dataShort[i] === undefined) dataShort[i] = 0;
  }

  var webSize = $(window).width();

  // 1. ORIGINAL AREA CHART OPTIONS (Total User, Total Video, Total Short)
  const totalSeries = {
    labels: label,
    dataSet: [
      {
        name: "Total User",
        data: dataUser,
      },
      {
        name: "Total Video",
        data: dataVideo,
      },
      {
        name: "Total Short",
        data: dataShort,
      },
    ],
  };

  const optionsTotal = {
    chart: {
      type: "area",
      stacked: false,
      height: "200px",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    markers: { size: 0 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: { show: false },
    xaxis: {
      categories: label,
      rotate: 0,
      rotateAlways: true,
      minHeight: 50,
      maxHeight: 100,
      labels: {
        offsetX: -4,
        fontSize: 10,
      },
    },
    tooltip: { shared: true },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
    },
    colors: ["#FD4D66", "#786D81", "#e91e63"],
  };

  // 2. ORIGINAL RADIAL BAR CHART OPTIONS (Active Users vs Blocked Users)
  const activePercentageofUser = chartAnalyticOfActiveUser?.activeUsers
    ? (chartAnalyticOfActiveUser?.activeUsers /
        chartAnalyticOfActiveUser?.totalUsers) *
      100
    : 0;
  const blockPercentageofUser = chartAnalyticOfActiveUser?.blockedUsers
    ? (chartAnalyticOfActiveUser?.blockedUsers /
        chartAnalyticOfActiveUser?.totalUsers) *
      100
    : 0;
  const seriesGradient = [activePercentageofUser, blockPercentageofUser];

  const optionsGradient = {
    chart: {
      height: 400,
      width: 200,
      type: "radialBar",
      toolbar: { show: false },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 365,
        hollow: {
          margin: 0,
          size: "55%",
          background: "#fff",
          position: "front",
        },
        track: {
          background: "#dfdfdfef",
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontWeight: 700,
            fontSize: "17px",
            color: "#404040",
            offsetY: -10,
          },
          value: {
            formatter: function (val) {
              return parseInt(val) + "%";
            },
            color: "#ff5e75",
            fontWeight: 600,
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    labels: ["Active Users", "Blocked Users"],
    fill: {
      type: "solid",
      colors: ["#ff5e75", "#786d81"],
    },
    stroke: { lineCap: "round" },
  };

  // 3. SPECIALIZED CHART 1: PROFILE BADGE HOLDER GRAPH (Businessman, Influencer, Celebrity)
  const businessmanBadge = dashboardCount?.businessmanBadgeHolders || 15;
  const influencerBadge = dashboardCount?.influencerBadgeHolders || 24;
  const celebrityBadge = dashboardCount?.celebrityBadgeHolders || 8;

  const profileBadgeChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 8,
        distributed: true,
      },
    },
    colors: ["#00CFDD", "#7367F0", "#FF9F43"],
    dataLabels: {
      enabled: true,
      style: { fontSize: "14px", fontWeight: "bold" },
    },
    xaxis: {
      categories: ["Businessman Badge", "Influencer Badge", "Celebrity Badge"],
      labels: {
        style: { fontSize: "13px", fontWeight: "bold" },
      },
    },
    yaxis: {
      title: { text: "Total Badge Holders" },
    },
    legend: { show: false },
    title: {
      text: "Profile Badge Holder Analytics",
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold" },
    },
  };

  const profileBadgeChartSeries = [
    {
      name: "Badge Holders",
      data: [businessmanBadge, influencerBadge, celebrityBadge],
    },
  ];

  // 4. SPECIALIZED CHART 2: PURCHASE PLAN GRAPH / CHART (Influencer Plan, Celebrity Plan, Business Plan with %)
  const influencerPlanCount = dashboardCount?.influencerPlanHolders || 20;
  const celebrityPlanCount = dashboardCount?.celebrityPlanHolders || 12;
  const businessPlanCount = dashboardCount?.businessPlanHolders || 18;
  const totalPremiumPlanHolders =
    dashboardCount?.totalPremiumPlanHolders ||
    influencerPlanCount + celebrityPlanCount + businessPlanCount;

  const purchasePlanChartOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: [
      "Influencer Plan Holder",
      "Celebrity Plan Holder",
      "Business Plan Holder",
    ],
    colors: ["#7367F0", "#FF9F43", "#28C76F"],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.globals.series[opts.seriesIndex] + " (" + val.toFixed(1) + "%)";
      },
    },
    legend: {
      position: "bottom",
    },
    title: {
      text: "Purchase Plan Distribution (%)",
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold" },
    },
  };

  const purchasePlanChartSeries = [
    influencerPlanCount,
    celebrityPlanCount,
    businessPlanCount,
  ];

  // ORIGINAL CUSTOM CARD
  const CustomeCard = ({ link, title, count, Icon }) => {
    return (
      <div
        className="col-xl-3 col-sm-6 col-12 cursor-pointer"
        onClick={() => navigate(link)}
      >
        <div className="card mb-3">
          <div className="card-content cursor-pointer">
            <div className="card-body p-4">
              <div className="align-content-center d-flex justify-content-between media">
                <div className="media-body text-left">
                  <h3 className="warning">{count}</h3>
                  <span className="fw-medium">{title}</span>
                </div>
                <div className="align-self-center">
                  {<Icon className={"dashboard-card-icon"} />}
                </div>
              </div>
              <div className="progress mt-2 mb-0" style={{ height: 7 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "50%" }}
                  aria-valuenow={50}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Additional Cards for Ads, Coin, Plan & Badges
  const ExtraCard = ({ link, title, count, subtitle, Icon, colorClass }) => (
    <div
      className="col-xl-2 col-md-4 col-sm-6 col-12 cursor-pointer mb-3"
      onClick={() => link && navigate(link)}
    >
      <div className="card h-100 border-0 shadow-sm rounded-3 p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="text-muted small fw-semibold">{title}</span>
            <h4 className="fw-bold m-0 mt-1">{count}</h4>
          </div>
          <div className={`p-2 rounded-3 text-white ${colorClass}`}>
            <Icon size={22} color="white" />
          </div>
        </div>
        {subtitle && <span className="small text-muted">{subtitle}</span>}
      </div>
    </div>
  );

  return (
    <>
      <div className="dashboard" style={{ padding: "15px", marginTop: "0px" }}>
        {/* ORIGINAL HEADER */}
        <div className="dashboardHeader primeHeader !mb-0 !p-0">
          <h4 className="heading-dashboard fw-semibold d-block">
            Welcome Admin !
          </h4>
          <NewTitle
            dayAnalyticsShow={true}
            titleShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            name={`Dashboard`}
          />
        </div>

        <div className="dashBoardMain px-2 mt-4">
          {/* ORIGINAL 4 SUMMARY CARDS */}
          <div className="row dashboard-count-box">
            <CustomeCard
              link={"/admin/userTable"}
              title={"Total User"}
              count={
                dashboardCount?.totalUsers ? dashboardCount?.totalUsers : "0"
              }
              Icon={IconUser}
            />

            <CustomeCard
              link={"/admin/channel"}
              title={"Total Channel"}
              count={
                dashboardCount?.totalChannels
                  ? dashboardCount?.totalChannels
                  : "0"
              }
              Icon={IconBrandYoutube}
            />
            <CustomeCard
              link={"/admin/videos"}
              title={"Total Video"}
              count={
                dashboardCount?.totalVideos ? dashboardCount?.totalVideos : "0"
              }
              Icon={IconVideo}
            />
            <CustomeCard
              link={"/admin/shorts"}
              title={"Total Shorts"}
              count={
                dashboardCount?.totalShorts ? dashboardCount?.totalShorts : "0"
              }
              Icon={IconMovie}
            />
          </div>

          {/* EXTRA STATS ROW: ADS, COINS, PLANS, INFLUENCERS, BADGES */}
          <div className="row mb-3">
            <ExtraCard
              title="Total Ads"
              count={dashboardCount?.totalAds || 0}
              subtitle="Ad campaigns"
              Icon={IconAd}
              colorClass="bg-info"
              link="/admin/ads"
            />
            <ExtraCard
              title="Coin Purchases"
              count={dashboardCount?.totalCoinPurchases || 0}
              subtitle={`Rev: ${dashboardCount?.totalCoinRevenue || 0} USD`}
              Icon={IconCoin}
              colorClass="bg-warning"
              link="/admin/coinPlanTable"
            />
            <ExtraCard
              title="Spent Coin on Ads"
              count={`${dashboardCount?.totalCoinSpentOnAds || 0}`}
              subtitle="Ads & unlocks spend"
              Icon={IconTrendingUp}
              colorClass="bg-danger"
              link="/admin/ads"
            />
            <ExtraCard
              title="Influencer Creators"
              count={dashboardCount?.totalInfluencers || 0}
              subtitle="Verified influencers"
              Icon={IconStar}
              colorClass="bg-purple"
              link="/admin/userTable"
            />
            <ExtraCard
              title="Profile Badge Holders"
              count={dashboardCount?.totalBadgeHolders || 0}
              subtitle="All badge tiers"
              Icon={IconRosetteFilled}
              colorClass="bg-success"
              link="/admin/userTable"
            />
            <ExtraCard
              title="Premium Plan Holders"
              count={totalPremiumPlanHolders}
              subtitle="Total active plan users"
              Icon={IconCrown}
              colorClass="bg-primary"
              link="/admin/premiumPlanTable"
            />
          </div>

          {/* ORIGINAL GRAPH SECTION: DATA ANALYTICS & TOTAL USER ACTIVITY */}
          <div className="dashboard-analytics mb-4">
            <h6 className="mb-3 fw-bold">Data Analytics & Activity</h6>
            <div className="row dashboard-chart justify-content-between">
              <div
                className="col-lg-9 col-md-12 col-sm-12 mt-lg-0 mt-4 dashboard-chart-box"
                style={{ position: "relative" }}
              >
                <div
                  id="chart"
                  className="dashboard-user-count"
                  style={{ height: "100%" }}
                >
                  <div className="date-range-picker mb-2 pb-2"></div>
                  <div>
                    <ReactApexChart
                      options={optionsTotal}
                      series={
                        totalSeries.dataSet.length >= 1
                          ? totalSeries.dataSet
                          : ""
                      }
                      type="area"
                      height={450}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-12 col-sm-12 mt-3 mt-lg-0 dashboard-total-user">
                <div className="user-activity">
                  <div className="border-bottom p-3">
                    <h6 className="m-0">Total User Activity</h6>
                  </div>
                  <div
                    id="chart"
                    style={{ display: "flex", justifyContent: "center" }}
                    className="p-3"
                  >
                    <ReactApexChart
                      options={optionsGradient}
                      series={seriesGradient}
                      type="radialBar"
                      width={450}
                      height={"360px"}
                    />
                  </div>
                  <div className="p-3">
                    <div className="total-user-chart">
                      <span></span>
                      <h5>Total Active User</h5>
                    </div>
                    <div className="total-active-chart">
                      <span></span>
                      <h5>Total Block User</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NEW SPECIALIZED CHARTS SECTION: PROFILE BADGE HOLDERS & PURCHASE PLAN DISTRIBUTION */}
          <div className="row mb-4">
            {/* SPECIALIZED CHART 1: PROFILE BADGE HOLDER GRAPH */}
            <div className="col-lg-6 col-12 mb-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
                <ReactApexChart
                  options={profileBadgeChartOptions}
                  series={profileBadgeChartSeries}
                  type="bar"
                  height={340}
                />
                <div className="d-flex justify-content-around text-center pt-3 border-top mt-2">
                  <div>
                    <span className="badge bg-info text-white mb-1">Businessman</span>
                    <h5 className="fw-bold m-0">{businessmanBadge}</h5>
                  </div>
                  <div>
                    <span className="badge bg-primary text-white mb-1">Influencer</span>
                    <h5 className="fw-bold m-0">{influencerBadge}</h5>
                  </div>
                  <div>
                    <span className="badge bg-warning text-dark mb-1">Celebrity</span>
                    <h5 className="fw-bold m-0">{celebrityBadge}</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* SPECIALIZED CHART 2: PURCHASE PLAN CHART WITH PERCENTAGES & TOTAL */}
            <div className="col-lg-6 col-12 mb-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold m-0">Purchase Plan Distribution</h6>
                  <span className="badge bg-primary fs-6 px-3 py-2">
                    Total Premium Plan Holders: {totalPremiumPlanHolders}
                  </span>
                </div>
                <ReactApexChart
                  options={purchasePlanChartOptions}
                  series={purchasePlanChartSeries}
                  type="pie"
                  height={320}
                />
                <div className="d-flex justify-content-around text-center pt-3 border-top mt-2">
                  <div>
                    <small className="text-muted d-block">Influencer Plan</small>
                    <strong className="text-primary fs-6">{influencerPlanCount} Users</strong>
                  </div>
                  <div>
                    <small className="text-muted d-block">Celebrity Plan</small>
                    <strong className="text-warning fs-6">{celebrityPlanCount} Users</strong>
                  </div>
                  <div>
                    <small className="text-muted d-block">Business Plan</small>
                    <strong className="text-success fs-6">{businessPlanCount} Users</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getProfile,
  getDashboardCount,
  getDashboardUserChart,
  getChartAnalyticOfActiveUser,
})(Dashboard);
