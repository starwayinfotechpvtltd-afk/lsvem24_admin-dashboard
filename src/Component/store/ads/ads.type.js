// ─── Ads Action Types ─────────────────────────────────────────────────────────

export const AD_LOADING         = "AD_LOADING";

// CRUD
export const GET_ADS            = "GET_ADS";
export const GET_AD_BY_ID       = "GET_AD_BY_ID";
export const CREATE_ADS         = "CREATE_ADS";
export const EDIT_ADS           = "EDIT_ADS";
export const DELETE_ADS         = "DELETE_ADS";

// Bulk operations
export const BULK_DELETE_ADS    = "BULK_DELETE_ADS";
export const BULK_TOGGLE_STATUS = "BULK_TOGGLE_STATUS";

// Status toggle
export const TOGGLE_AD_STATUS   = "TOGGLE_AD_STATUS";

// Stats tracking
export const RECORD_AD_VIEW     = "RECORD_AD_VIEW";
export const RECORD_AD_CLICK    = "RECORD_AD_CLICK";
export const RESET_AD_STATS     = "RESET_AD_STATS";

// Analytics & active ads
export const GET_AD_ANALYTICS   = "GET_AD_ANALYTICS";
export const GET_ACTIVE_ADS     = "GET_ACTIVE_ADS";