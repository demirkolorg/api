var express = require("express");
var router = express.Router();
const Response = require("../lib/Response");
const Roles = require("../db/models/Roles");
const Enum = require("../config/Enum");
const ms = require("../lib/MagicStrings");
const RolePrivileges = require("../db/models/RolePrivileges");
const role_privileges = require("../config/role_privileges");
const AuditLogs = require("../lib/AuditLogs");
const CustomError = require("../lib/Error");

router.get("/", async (req, res, next) => {
  try {
    let roles = await Roles.find({});

    AuditLogs.info({
      email: "req.user?.email",
      location: Enum.END_POINTS.ROLES,
      proc_type: Enum.PROCESSES_TYPES.LIST,
      log: { ...roles },
    });

    res.json(
      Response.successResponse(
        roles,
        ms.Roles.list.listelemeBasariliTitle,
        ms.Roles.list.listelemeBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/add", async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.role_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Roles.add.nameValidationErrorMsg,
        ms.Roles.add.nameValidationErrorDesc
      );

    if (
      !body.permissions ||
      !Array.isArray(body.permissions) ||
      body.permissions.length == 0
    )
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Roles.add.permissionValidationErrorMsg,
        ms.Roles.add.permissionValidationErrorDesc
      );

    let role = new Roles({
      role_name: body.role_name,
      is_active: true,
      created_by: "req.user?.id", // TODO: user login is required
    });

    await role.save();

    AuditLogs.info({
      email: "req.user?.email",
      location: Enum.END_POINTS.ROLES,
      proc_type: Enum.PROCESSES_TYPES.CREATE,
      log: { ...role },
    });

    for (let i = 0; i < body.permissions.length; i++) {
      let priv = new RolePrivileges({
        role_id: role._id,
        permission: body.permissions[i],
        created_by: "req.user?.id", // TODO: user login is required
      });
      await priv.save();
    }

    res.json(
      Response.successResponse(
        role,
        ms.Roles.add.eklemeBasariliTitle,
        ms.Roles.add.eklemeBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update", async (req, res, next) => {
  let body = req.body;
  try {
    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Roles.update.idValidationErrorMsg,
        ms.Roles.update.idValidationErrorDesc
      );

    let updates = {};

    if (body.role_name) updates.role_name = body.role_name;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

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
            created_by: "req.user?.id", // TODO: user login is required
          });
          await priv.save();
        }
      }
    }

    await Roles.updateOne({ _id: body._id }, updates);
    let role = await Roles.find({ _id: body._id });

    AuditLogs.info({
      email: "req.user?.email",
      location: Enum.END_POINTS.ROLES,
      proc_type: Enum.PROCESSES_TYPES.UPDATE,
      log: { ...role },
    });

    res.json(
      Response.successResponse(
        role,
        ms.Roles.update.guncellemeBasariliTitle,
        ms.Roles.update.guncellemeBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/delete", async (req, res, next) => {
  let body = req.body;
  try {
    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Roles.delete.idValidationErrorMsg,
        ms.Roles.delete.idValidationErrorDesc
      );

    let roles = await Roles.find({ _id: body._id });

    await Roles.deleteOne({ _id: body._id });

    AuditLogs.info({
      email: "req.user?.email",
      location: Enum.END_POINTS.ROLES,
      proc_type: Enum.PROCESSES_TYPES.DELETE,
      log: { ...roles },
    });

    res.json(
      Response.successResponse(
        roles,
        ms.Roles.delete.silmeBasariliTitle,
        ms.Roles.delete.silmeBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.get("/role_privileges", async (req, res, next) => {
  res.json(role_privileges);
});

module.exports = router;
