const Enum = require("../config/Enum");

module.exports = {
  COMMON: {
    VALIDATION_ERROR_TITLE: "Validation Error",
    ALREADY_EXIST: "Already Exists!",
    UNKNOWN_ERROR: "Unknown Error!",
    FIELD_MUST_BE_FILLED: "{} field must be filled!",

    LIST_SUCCESSFUL_TITLE: "Listing Successful",
    LIST_SUCCESSFUL_DESC: "Listing {} records done successfully",

    ADD_SUCCESSFUL_TITLE: "Add Successful",
    ADD_SUCCESSFUL_DESC: "Adding {} successfully",

    UPDATE_SUCCESSFUL_TITLE: "Update Successful",
    UPDATE_SUCCESSFUL_DESC: "{} update done successfully",

    DELETE_SUCCESSFUL_TITLE: "Delete Successful",
    DELETE_SUCCESSFUL_DESC: "{} deletion done successfully",

    REPORT_SUCCESSFUL_TITLE: "Reporting Successful",
    REPORT_SUCCESSFUL_DESC: "{} Reporting done successfully",

    PRINT_SUCCESSFUL_TITLE: "Print Successful",
    PRINT_SUCCESSFUL_DESC: "{} printing done successfully",
  },
  USER: {
    IS_EMAIL:"The value entered in the Email field must be a valid email address.",
    PASSWORD_LENGTH:`Password length cannot be less than ${Enum.PASS_LENGTH} characters`,
    ROLE_VALIDATION:"The Role field is required and must be an array."
  },
  AUTH:{
    VALIDATE_FIELD_BEFORE_AUTH:"Email or password is incorrect.",
    AUTH_SUCCESSFUL_TITLE:"Auth Successful",
    AUTH_SUCCESSFUL_DESC:"Auth operation successfully performed.",
    UNAUTHORIZED_ACCESS_TITLE:"Unauthorized Access",
    UNAUTHORIZED_ACCESS_DESC:"You are not authorized to perform this operation, contact the system administrator.",

  },
  PARAMS: {
    ID: "_id",
    NAME: "name",
    FIRST_NAME: "first name",
    LAST_NAME: "last name",
    EMAIL: "email",
    PASSWORD: "password",
    PERMISSION: "permission",
    ROLE_NAME: "role name",
  },
  ENDPOINTS: {
    CATEGORIES: "categories",
    CATEGORY: "category",
    USER_ROLES: "user roles",
    USER_ROLE: "user role",
    ROLES: "roles",
    ROLE: "role",
    USERS: "users",
    USER: "user",
    AUDIT_LOGS: "audit logs",
    AUDIT_LOG: "audit log",
  },
  PROCESSES_TYPES: {
    LIST: "LIST",
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    REPORT: "REPORT",
    PRINT: "PRINT",
  },
};
