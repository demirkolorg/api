var express = require("express");
var router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const ms = require("../lib/MagicStrings");
const AuditLogs = require("../lib/AuditLogs");
const Logger = require("../lib/logs/LoggerClass");
const auth = require("../lib/auth")();

router.all("*", auth.authenticate(), (res, req, next) => {
  next();
});

router.get("/",auth.checkRoles("category_view"), async (req, res, next) => {
  try {
    let categories = await Categories.find({});

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.CATEGORIES,
      proc_type: Enum.PROCESSES_TYPES.LIST,
      log: { ...categories },
    });

    res.json(
      Response.successResponse(
        categories,
        ms.Categories.list.listelemeBasariliTitle,
        ms.Categories.list.listelemeBasariliDesc
      )
    );
  } catch (err) {
    Logger.error({
      email: req.user?.email,
      location: Enum.END_POINTS.CATEGORIES,
      proc_type: Enum.PROCESSES_TYPES.LIST,
      log: err,
    });

    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/add",auth.checkRoles("category_add"), async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Categories.add.nameValidationErrorMsg,
        ms.Categories.add.nameValidationErrorDesc
      );

    let category = new Categories({
      name: body.name,
      is_active: true,
      created_by: req.user?.id,
    });

    await category.save();

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.CATEGORIES,
      proc_type: Enum.PROCESSES_TYPES.CREATE,
      log: { ...category },
    });

    Logger.info(
      req.user?.email,
      Enum.END_POINTS.CATEGORIES,
      Enum.PROCESSES_TYPES.CREATE,
      category
    );

    res.json(
      Response.successResponse(
        category,
        ms.Categories.add.eklemeBasariliTitle,
        ms.Categories.add.eklemeBasariliDesc
      )
    );
  } catch (err) {
    Logger.error(
      req.user?.email,
      Enum.END_POINTS.CATEGORIES,
      Enum.PROCESSES_TYPES.CREATE,
      err
    );

    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update",auth.checkRoles("category_update"), async (req, res, next) => {
  let body = req.body;
  try {
    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Categories.update.idValidationErrorMsg,
        ms.Categories.update.idValidationErrorDesc
      );

    let updates = {};

    if (body.name) updates.name = body.name;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
    await Categories.updateOne({ _id: body._id }, updates);
    let category = await Categories.find({ _id: body._id });

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.CATEGORIES,
      proc_type: Enum.PROCESSES_TYPES.UPDATE,
      log: { ...category },
    });

    res.json(
      Response.successResponse(
        category,
        ms.Categories.update.guncellemeBasariliTitle,
        ms.Categories.update.guncellemeBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/delete",auth.checkRoles("category_delete"), async (req, res, next) => {
  let body = req.body;
  try {
    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        ms.Categories.delete.idValidationErrorMsg,
        ms.Categories.delete.idValidationErrorDesc
      );

    let removedCategory = await Categories.find({ _id: body._id });

    await Categories.deleteOne({ _id: body._id });

    AuditLogs.info({
      email: req.user?.email,
      location: Enum.END_POINTS.CATEGORIES,
      proc_type: Enum.PROCESSES_TYPES.DELETE,
      log: { ...removedCategory },
    });

    res.json(
      Response.successResponse(
        removedCategory,
        ms.Categories.delete.silmeBasariliTitle,
        ms.Categories.delete.silmeBasariliDesc
      )
    );
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
