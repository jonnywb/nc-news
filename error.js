exports.handle404 = (req, res) => {
  res.status(404).send({ msg: "Not Found" });
};

exports.handlePsqlError = (err, req, res, next) => {
  const badRequests = ["22P02", "23502", "23503"];
  if (badRequests.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
