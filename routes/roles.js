var express = require("express");
var router = express.Router();
const Response = require("../lib/Response");
const Roles = require("../db/models/Roles");
const Enum = require("../config/Enum");
// const ms = require("../lib/MagicStrings");
const i18n = new (require("../lib/i18n"))();
const RolePrivileges = require("../db/models/RolePrivileges");
const role_privileges = require("../config/role_privileges");
const AuditLogs = require("../lib/AuditLogs");
const CustomError = require("../lib/Error");
const auth = require("../lib/auth")();

router.all("*", auth.authenticate(), (res, req, next) => {
  next();
});

router.get("/", auth.checkRoles("role_view"), async (req, res, next) => {
  try {
    let roles = await Roles.find({});

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.ROLES,
      proc_type: Enum.PROCESSES_TYPES.LIST,
      log: { ...roles },
    });

    res.json(
      Response.successResponse(
        roles,
        i18n.translate("COMMON.LIST_SUCCESSFUL_TITLE", req.user.language),
        i18n.translate("COMMON.LIST_SUCCESSFUL_DESC", req.user.language, [
          "ENDPOINTS.ROLE",
        ])
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/add", auth.checkRoles("role_add"), async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.role_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.ROLE_NAME",
        ])
      );

    if (
      !body.permissions ||
      !Array.isArray(body.permissions) ||
      body.permissions.length == 0
    )
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.PERMISSION",
        ])
      );

    let role = new Roles({
      role_name: body.role_name,
      is_active: true,
      created_by: req.user?.id,
    });

    await role.save();

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.ROLES,
      proc_type: Enum.PROCESSES_TYPES.CREATE,
      log: { ...role },
    });

    for (let i = 0; i < body.permissions.length; i++) {
      let priv = new RolePrivileges({
        role_id: role._id,
        permission: body.permissions[i],
        created_by: req.user?.id,
      });
      await priv.save();
    }

    res.json(
      Response.successResponse(
        role,
        i18n.translate("COMMON.ADD_SUCCESSFUL_TITLE", req.user.language),
        i18n.translate("COMMON.ADD_SUCCESSFUL_DESC", req.user.language, [
          "ENDPOINTS.ROLE",
        ])
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post(
  "/update",
  auth.checkRoles("role_update"),
  async (req, res, next) => {
    let body = req.body;
    try {
      if (!body._id)
        throw new CustomError(
          Enum.HTTP_CODES.BAD_REQUEST,
          i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
          i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
            "PARAMS.ID",
          ])
        );

      let updates = {};

      if (body.role_name) updates.role_name = body.role_name;
      if (typeof body.is_active === "boolean")
        updates.is_active = body.is_active;

      if (
        body.permissions &&
        Array.isArray(body.permissions) &&
        body.permissions.length > 0
      ) {
        let permissions = await RolePrivileges.find({ role_id: body._id });
        let removePermissions = permissions.filter(
          (p) => !body.permissions.includes(p.permission)
        );
        let newPermissions = body.permissions.filter(
          (p) => !permissions.map((s) => s.permission).includes(p)
        );

        if (removePermissions.length > 0) {
          await RolePrivileges.deleteMany({
            _id: { $in: removePermissions.map((I) => I._id) },
          });
        }

        if (newPermissions.length > 0) {
          for (let i = 0; i < newPermissions.length; i++) {
            let priv = new RolePrivileges({
              role_id: body._id,
              permission: newPermissions[i],
              created_by: req.user?.id,
            });
            await priv.save();
          }
        }
      }

      await Roles.updateOne({ _id: body._id }, updates);
      let role = await Roles.find({ _id: body._id });

      AuditLogs.info({
        email: req.user?.email,
        location: Enum.END_POINTS.ROLES,
        proc_type: Enum.PROCESSES_TYPES.UPDATE,
        log: { ...role },
      });

      res.json(
        Response.successResponse(
          role,
          i18n.translate("COMMON.UPDATE_SUCCESSFUL_TITLE", req.user.language),
          i18n.translate("COMMON.UPDATE_SUCCESSFUL_DESC", req.user.language, [
            "ENDPOINTS.ROLE",
          ])
        )
      );
    } catch (err) {
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
);

router.post(
  "/delete",
  auth.checkRoles("role_delete"),
  async (req, res, next) => {
    let body = req.body;
    try {
      if (!body._id)
        throw new CustomError(
          Enum.HTTP_CODES.BAD_REQUEST,
          i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
          i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
            "PARAMS.ID",
          ])
        );

      let roles = await Roles.find({ _id: body._id });

      await Roles.deleteOne({ _id: body._id });

      AuditLogs.info({
        email: req.user?.email,
        location: Enum.END_POINTS.ROLES,
        proc_type: Enum.PROCESSES_TYPES.DELETE,
        log: { ...roles },
      });

      res.json(
        Response.successResponse(
          roles,
          i18n.translate("COMMON.DELETE_SUCCESSFUL_TITLE", req.user.language),
          i18n.translate("COMMON.DELETE_SUCCESSFUL_DESC", req.user.language, [
            "ENDPOINTS.ROLE",
          ])
        )
      );
    } catch (err) {
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
);

router.get("/role_privileges", async (req, res, next) => {
  res.json(role_privileges);
});

module.exports = router;
