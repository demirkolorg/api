const express = require("express");
const router = express.Router();
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
// const ms = require("../lib/MagicStrings");
const i18n = new (require("../lib/i18n"))();
const bcrypt = require("bcrypt");
const is = require("is_js");
const Users = require("../db/models/Users");
const UserRoles = require("../db/models/UserRoles");
const AuditLogs = require("../lib/AuditLogs");
const Roles = require("../db/models/Roles");
const config = require("../config");
const jwt = require("jwt-simple");
const auth = require("../lib/auth")();

router.post("/register", async (req, res) => {
  let body = req.body;
  try {
    let user = await Users.findOne({});
    if (user) {
      return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND);
    }

    if (!body.first_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.FIRST_NAME",
        ])
      );

    if (!body.last_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.LAST_NAME",
        ])
      );

    if (!body.email)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.EMAIL",
        ])
      );

    if (!is.email(body.email))
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("USER.IS_EMAIL", req.user.language, ["PARAMS.NAME"])
      );

    if (!body.password)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.PASSWORD",
        ])
      );

    if (body.password < Enum.PASS_LENGTH)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("USER.PASSWORD_LENGTH", req.user.language)
      );

    let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

    let createdUser = await Users.create({
      email: body.email,
      password: password,
      is_active: body.is_active,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number,
    });

    if (createdUser) {
      AuditLogs.info({
        email: req.user?.email,
        location: Enum.END_POINTS.USERS,
        proc_type: Enum.PROCESSES_TYPES.CREATE,
        log: { ...createdUser },
      });
    }

    let createdRole = await Roles.create({
      role_name: Enum.SUPER_ADMIN,
      is_active: true,
      created_by: createdUser._id,
    });

    if (createdRole) {
      AuditLogs.info({
        email: req.user?.email,
        location: Enum.END_POINTS.ROLES,
        proc_type: Enum.PROCESSES_TYPES.CREATE,
        log: { ...createdRole },
      });
    }

    await UserRoles.create({
      role_id: createdRole._id,
      user_id: createdUser._id,
    });

    if (UserRoles) {
      AuditLogs.info({
        email: req.user?.email,
        location: Enum.END_POINTS.USER_ROLES,
        proc_type: Enum.PROCESSES_TYPES.CREATE,
        log: { ...UserRoles },
      });
    }

    res.json(
      Response.successResponse(
        createdUser,
        i18n.translate("COMMON.ADD_SUCCESSFUL_TITLE", req.user.language),
        i18n.translate("COMMON.ADD_SUCCESSFUL_DESC", req.user.language, [
          "ENDPOINTS.USER",
        ])
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/auth", async (req, res) => {
  let { email, password, language } = req.body;
  try {
    Users.validateFieldBeforeAuht(email, password);

    let user = await Users.findOne({ email });

    if (!user) {
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("AUTH.VALIDATE_FIELD_BEFORE_AUTH", req.user.language)
      );
    }
    if (!user.validPassword(password)) {
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("AUTH.VALIDATE_FIELD_BEFORE_AUTH", req.user.language)
      );
    }

    let payload = {
      id: user._id,
      exp: parseInt(Date.now() / 1000) * config.JWT.EXPIRE_TIME,
    };
    let token = jwt.encode(payload, config.JWT.SECRET);
    let userData = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    res.json(
      Response.successResponse(
        { token: token, user: userData },
        i18n.translate("AUTH.AUTH_SUCCESSFUL_TITLE", language),
        i18n.translate("AUTH.AUTH_SUCCESSFUL_DESC", language)
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.all("*", auth.authenticate(), (res, req, next) => {
  next();
});

router.get("/", auth.checkRoles("user_view"), async (req, res) => {
  try {
    let users = await Users.find({});

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.USERS,
      proc_type: Enum.PROCESSES_TYPES.LIST,
      log: { ...users },
    });

    res.json(
      Response.successResponse(
        users,
        i18n.translate("COMMON.ADD_SUCCESSFUL_TITLE", req.user.language),
        i18n.translate("COMMON.ADD_SUCCESSFUL_DESC", req.user.language, [
          "ENDPOINTS.USER",
        ])
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/add", auth.checkRoles("user_add"), async (req, res) => {
  let body = req.body;
  try {
    if (!body.first_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.FIRST_NAME",
        ])
      );

    if (!body.last_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.LAST_NAME",
        ])
      );

    if (!body.email)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.EMAIL",
        ])
      );

    if (!is.email(body.email))
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("USER.IS_EMAIL", req.user.language, ["PARAMS.NAME"])
      );

    if (!body.password)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, [
          "PARAMS.PASSWORD",
        ])
      );

    if (body.password < Enum.PASS_LENGTH)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("USER.PASSWORD_LENGTH", req.user.language)
      );

    if (!body.roles || !Array.isArray(body.roles) || body.roles.length == 0)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("USER.ROLE_VALIDATION", req.user.language)
      );

    let roles = await Roles.find({ _id: { $in: body.roles } });

    if (roles.length == 0)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("USER.ROLE_VALIDATION", req.user.language)
      );

    let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

    let createdUser = await Users.create({
      email: body.email,
      password: password,
      is_active: body.is_active,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number,
    });

    for (let i = 0; i < roles.length; i++) {
      console.log(roles[i]);
      await UserRoles.create({
        role_id: roles[i]._id,
        user_id: createdUser._id,
      });
    }

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.USERS,
      proc_type: Enum.PROCESSES_TYPES.CREATE,
      log: { ...createdUser },
    });

    res.json(
      Response.successResponse(
        createdUser,
        i18n.translate("COMMON.ADD_SUCCESSFUL_TITLE", req.user.language),
        i18n.translate("COMMON.ADD_SUCCESSFUL_DESC", req.user.language, [
          "ENDPOINTS.USER",
        ])
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update", auth.checkRoles("user_update"), async (req, res) => {
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

    let roles = Roles.find({ _id: { $in: body.roles } });

    if (roles.length == 0)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language),
        i18n.translate("USER.ROLE_VALIDATION", req.user.language)
      );
    let updates = {};

    if (body.password && body.password.length >= Enum.PASS_LENGTH) {
      updates.password = bcrypt.hashSync(
        body.password,
        bcrypt.genSaltSync(8),
        null
      );
    }
    if (body.first_name) updates.first_name = body.first_name;
    if (body.last_name) updates.last_name = body.last_name;
    if (body.phone_number) updates.phone_number = body.phone_number;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

    if (Array.isArray(body.roles) && body.roles.length > 0) {
      let userRoles = await UserRoles.find({ user_id: body._id });

      let removedRoles = userRoles.filter(
        (r) => !body.roles.includes(r.role_id)
      );
      let newRoles = body.roles.filter(
        (p) => !userRoles.map((r) => r.role_id).includes(p)
      );

      if (removedRoles.length > 0) {
        await UserRoles.deleteMany({
          _id: { $in: removedRoles.map((I) => I._id) },
        });
      }

      if (newRoles.length > 0) {
        for (let i = 0; i < newRoles.length; i++) {
          let userRole = new UserRoles({
            role_id: newRoles[i],
            user_id: body._id,
          });
          await userRole.save();
        }
      }
    }

    await Users.updateOne({ _id: body._id }, updates);
    let user = await Users.find({ _id: body._id });

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.USERS,
      proc_type: Enum.PROCESSES_TYPES.UPDATE,
      log: { ...user },
    });

    res.json(
      Response.successResponse(
        user,
        i18n.translate("COMMON.UPDATE_SUCCESSFUL_TITLE", req.user.language),
        i18n.translate("COMMON.UPDATE_SUCCESSFUL_DESC", req.user.language, [
          "ENDPOINTS.USER",
        ])
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/delete", auth.checkRoles("user_delete"), async (req, res) => {
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

    let removedUser = await Users.find({ _id: body._id });

    await Users.deleteOne({ _id: body._id });
    await UserRoles.deleteMany({ user_id: body._id });

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.USERS,
      proc_type: Enum.PROCESSES_TYPES.DELETE,
      log: { ...removedUser },
    });

    res.json(
      Response.successResponse(
        removedUser,
        i18n.translate("COMMON.DELETE_SUCCESSFUL_TITLE", req.user.language),
        i18n.translate("COMMON.DELETE_SUCCESSFUL_DESC", req.user.language, [
          "ENDPOINTS.USER",
        ])
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
