const db = require("../db/connection");
const format = require("pg-format");
const expressListEndpoints = require("express-list-endpoints");

exports.checkExists = (table, column, value) => {
  const queryString = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  return db.query(queryString, [value]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  });
};

exports.getEndpoints = (app) => {
  const endpoints = expressListEndpoints(app);

  return endpoints
    .filter((endpoint) => endpoint.path !== "*")
    .reduce((endpointArr, val) => {
      const newEndpoints = [];
      val.methods.forEach((method) => {
        const endpointStr = `${method} ${val.path}`;
        newEndpoints.push(endpointStr);
      });

      return endpointArr.concat(newEndpoints);
    }, []);
};
