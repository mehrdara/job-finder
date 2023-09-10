module.exports = (req, res, next) => {
  let page = +req.query.page || 1;
  let limit = +req.query.limit || 3;
  let search = new RegExp(searchTerm, "gi") || "";
  let context;
  context = { page, limit, skip, search, searchTerm };
  req.context = context;
  next();
};
