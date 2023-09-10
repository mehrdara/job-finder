const express = require("express");
const router = express.Router();
const jobsJSON = require("../jobs.json");
router.get("/", async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const offset = req.query.offset || (page - 1) * limit;

  const paginatedItems = jobsJSON.slice(offset).slice(0, limit);
  const total_pages = Math.ceil(jobsJSON.length / limit);
  res.status(200).json({
    currentPage: page,
    limit: limit,
    previousPage:
      page - 1
        ? `${process.env.BASE_URL}api/results?page=${
            parseInt(page) - 1
          }&limit=${limit}`
        : null,
    nextPage:
      total_pages > page
        ? `${process.env.BASE_URL}api/results?page=${
            parseInt(page) + 1
          }&limit=${limit}`
        : null,

    totalJobs: jobsJSON.length,
    totalPages: total_pages,
    data: paginatedItems,
  });
});
module.exports = router;
