const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(
        new ApiError(`cant not delete document with this id ${id}`, 400)
      );
    }
    document.remove();
    res.status(204).json({ msg: "Delete success", result: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new ApiError("something went error , faild update !", 400));
    }
    document.save();
    res.status(203).json({ msg: "success update", data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    let document = await Model.create(req.body);
    if (!document) {
      return next(new ApiError(`your create ${Model} faild`, 500));
    }
    res.status(201).json({ msg: "success create", document });
  });

exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    let document;
    if (populateOpt) {
      document = await query.populate(populateOpt);
    } else {
      document = await query;
    }
    if (!document) {
      return next(
        new ApiError(`there are not document with this id : ${id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const countDocument = await Model.countDocuments();
    const apiFeature = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocument)
      .filteration()
      .limiting()
      .seraching()
      .sorting();
    const { mongooseQuery, paginationResult } = apiFeature;
    const document = await mongooseQuery;
    if (!document) {
      return next(new ApiError(`there are not any ${Model} here `));
    }
    res.status(200).json({
      resutl: document.length,
      paginationResult,
      document,
    });
  });
