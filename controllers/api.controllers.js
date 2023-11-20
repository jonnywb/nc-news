const { returnApi } = require("../models/api.models");

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints: returnApi() });
};
