class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filteration() {
    let queryObjFirst = { ...this.queryString };
    const forDelete = ["limit", "page", "sort", "fields"];
    forDelete.forEach((ele) => delete queryObjFirst[ele]);
    const queryObjSecond = JSON.stringify(queryObjFirst).replace(
      /\b(gte|gt|lte|lt)\b/gi,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryObjSecond));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }
  limiting() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-_v");
    }
    return this;
  }
  seraching() {
    if (this.queryString.keyWord) {
      let searchObj = {};
      searchObj.$or = [
        { title: { $regex: this.queryString.keyWord, $options: "igm" } },
        { description: { $regex: this.queryString.keyWord, $options: "igm" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(searchObj);
    }
    return this;
  }
  paginate(countDocument) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    if (endIndex < countDocument) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    pagination.numPages = Math.ceil(countDocument / limit);
    this.paginationResult = pagination;
    this.mongooseQuery = this.mongooseQuery.find().skip(skip).limit(limit);
    return this;
  }
}
module.exports = ApiFeatures;
