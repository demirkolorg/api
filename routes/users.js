var express = require("express");
var router = express.Router();
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const ms = require("../lib/MagicStrings");
const bcrypt = require("bcrypt");
const is = require("is_js");
const Users = require("../db/models/Users");
const UserRoles = require("../db/models/UserRoles");
const AuditLogs = require("../lib/AuditLogs");
const Roles = require("../db/models/Roles");
const config = require("../config");
const jwt = require("jwt-simple");

router.get("/", async (req, res, next) => {
  try {
    let users = await Users.find({});

    AuditLogs.info({
      email: "req.user?.email",
      location: Enum.END_POINTS.USERS,
      proc_type: Enum.PROCESSES_TYPES.LIST,
      log: { ...users },
    });

    res.json(
      Response.successResponse(
        users,
        ms.Users.list.listelemeBasariliTitle,
        ms.Users.list.listelemeBasariliDesc
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
    if (!body.first_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.first_nameValidationErrorMsg,
        ms.Users.add.first_nameValidationErrorDesc
      );

    if (!body.last_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.last_nameValidationErrorMsg,
        ms.Users.add.last_nameValidationErrorDesc
      );

    if (!body.email)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.emailValidationErrorMsg,
        ms.Users.add.emailValidationErrorDesc
      );

    if (!is.email(body.email))
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.isEmailValidationErrorMsg,
        ms.Users.add.isEmailValidationErrorDesc
      );

    if (!body.password)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.passwordValidationErrorMsg,
        ms.Users.add.passwordValidationErrorDesc
      );

    if (body.password < Enum.PASS_LENGTH)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.passwordLenghtValidationErrorMsg,
        ms.Users.add.passwordLenghtValidationErrorDesc
      );

    if (!body.roles || !Array.isArray(body.roles) || body.roles.length == 0)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.rolesValidationErrorMsg,
        ms.Users.add.rolesValidationErrorDesc
      );

    let roles = await Roles.find({ _id: { $in: body.roles } });

    if (roles.length == 0)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.rolesValidationErrorMsg,
        ms.Users.add.rolesValidationErrorDesc
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
      email: "req.user?.email",
      location: Enum.END_POINTS.USERS,
      proc_type: Enum.PROCESSES_TYPES.CREATE,
      log: { ...createdUser },
    });

    res.json(
      Response.successResponse(
        createdUser,
        ms.Users.add.eklemeBasariliTitle,
        ms.Users.add.eklemeBasariliDesc
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
        ms.Users.update.idValidationErrorMsg,
        ms.Users.update.idValidationErrorDesc
      );

    let roles = Roles.find({ _id: { $in: body.roles } });

    if (roles.length == 0)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.rolesValidationErrorMsg,
        ms.Users.add.rolesValidationErrorDesc
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
      email: "req.user?.email",
      location: Enum.END_POINTS.USERS,
      proc_type: Enum.PROCESSES_TYPES.UPDATE,
      log: { ...user },
    });

    res.json(
      Response.successResponse(
        user,
        ms.Users.update.guncellemeBasariliTitle,
        ms.Users.update.guncellemeBasariliDesc
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
        ms.Users.delete.idValidationErrorMsg,
        ms.Users.delete.idValidationErrorDesc
      );

    let removedUser = await Users.find({ _id: body._id });

    await Users.deleteOne({ _id: body._id });
    await UserRoles.deleteMany({ user_id: body._id });

    AuditLogs.info({
      email: "req.user?.email",
      location: Enum.END_POINTS.USERS,
      proc_type: Enum.PROCESSES_TYPES.DELETE,
      log: { ...removedUser },
    });

    res.json(
      Response.successResponse(
        removedUser,
        ms.Users.delete.silmeBasariliTitle,
        ms.Users.delete.silmeBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/register", async (req, res, next) => {
  let body = req.body;
  try {
    let user = await Users.findOne({});
    if (user) {
      return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND);
    }

    if (!body.first_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.first_nameValidationErrorMsg,
        ms.Users.add.first_nameValidationErrorDesc
      );

    if (!body.last_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.last_nameValidationErrorMsg,
        ms.Users.add.last_nameValidationErrorDesc
      );

    if (!body.email)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.emailValidationErrorMsg,
        ms.Users.add.emailValidationErrorDesc
      );

    if (!is.email(body.email))
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.isEmailValidationErrorMsg,
        ms.Users.add.isEmailValidationErrorDesc
      );

    if (!body.password)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.passwordValidationErrorMsg,
        ms.Users.add.passwordValidationErrorDesc
      );

    if (body.password < Enum.PASS_LENGTH)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Users.add.passwordLenghtValidationErrorMsg,
        ms.Users.add.passwordLenghtValidationErrorDesc
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
        email: "req.user?.email",
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
        email: "req.user?.email",
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
        email: "req.user?.email",
        location: Enum.END_POINTS.USER_ROLES,
        proc_type: Enum.PROCESSES_TYPES.CREATE,
        log: { ...UserRoles },
      });
    }

    res.json(
      Response.successResponse(
        createdUser,
        ms.Users.add.eklemeBasariliTitle,
        ms.Users.add.eklemeBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/auth", async (req, res) => {
  let { email, password } = req.body;
  try {
    Users.validateFieldBeforeAuht(email, password);

    let user = await Users.findOne({ email });

    if (!user) {
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        ms.Roles,
        ms.Auth.validateFieldBeforeAuhtMsg,
        ms.Auth.validateFieldBeforeAuhtDesc
      );
    }
    if (!user.validPassword(password)) {
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        ms.Roles,
        ms.Auth.validateFieldBeforeAuhtMsg,
        ms.Auth.validateFieldBeforeAuhtDesc
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
        ms.Auth.authBasariliMsg,
        ms.Auth.authBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
