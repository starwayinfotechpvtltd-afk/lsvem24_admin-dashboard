import { secretKey } from "../../../util/config";
import { SetDevKey, setToken } from "../../../util/setAuth";
import * as ActionType from "./admin.type";
import jwt_decode from "jwt-decode";

const initialState = {
  admin: {},
  isAuth: false,
};

export const adminReducer = (state = initialState, action) => {
  let decode;
  console.log(action?.data?.data);
  switch (action.type) {
    case ActionType.LOGIN_ADMIN:
      if (action.payload) {
        decode = jwt_decode(action.payload);
      }

      const oldAdmin = JSON.parse(sessionStorage.getItem("admin")) || {};

      const adminData = {
        ...decode,
        userId: action?.data?.data?.userId || oldAdmin.userId,
        isAdmin:
          action?.data?.data?.isAdmin !== undefined
            ? action.data.data.isAdmin
            : oldAdmin.isAdmin,
      };

      setToken(action.payload);
      SetDevKey(secretKey);

      sessionStorage.setItem("token", action.payload);
      sessionStorage.setItem("key", secretKey);
      sessionStorage.setItem("isAuth", "true");
      sessionStorage.setItem("admin", JSON.stringify(adminData));
      sessionStorage.setItem("isAdmin", String(adminData.isAdmin));

      return {
        ...state,
        admin: adminData,
        isAuth: true,
      };
    case ActionType.LOGOUT_ADMIN:
      window.sessionStorage.clear();

      setToken(null);
      SetDevKey(null);
      return {
        ...state,
        admin: {},
        isAuth: false,
      };

    case ActionType.UPDATE_PROFILE:
      return {
        ...state,
        admin: {
          ...state.admin,
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          image: action.payload.image,
          flag: action.payload.flag,
          password: action.payload.password,
        },
      };
    case ActionType.ADMIN_EARNING:
      return {
        ...state,
        earning: action.payload.earning,
        total: action.payload.total,
        totalEarning: action.payload.totalEarning,
      };
    case ActionType.COIN_PLAN_EARNING:
      return {
        ...state,
        earning: action.payload.earning,
        total: action.payload.total,
        totalEarning: action.payload.totalEarning,
      };
    case ActionType.LOGOUT_ADMIN:
      sessionStorage.removeItem("key", secretKey);
      sessionStorage.removeItem("token", setToken);
      sessionStorage.removeItem("isAuth", false);
      sessionStorage.removeItem("demo");
      setToken(null);
      SetDevKey(null);

    case ActionType.CLEAN_EARNING:
      return {
        ...state,
        earning: [],
        total: "",
        totalEarning: "",
      };

      return {
        ...state,
        admin: {},
        isAuth: false,
      };
    default:
      return state;
  }
};
