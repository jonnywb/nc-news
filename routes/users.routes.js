const usersRouter = require("express").Router();

const { getUsers } = require("../controllers/users.controllers");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
