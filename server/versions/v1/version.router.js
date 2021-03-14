const express = require("express");
const router = express.Router();


const usersRouter = require("./routes/users.router");
const projectsRouter = require("./routes/projects.router");
const tasksRouter = require("./routes/tasks.router");

router.get("/", function (req, res) {
    res.status(200).send({status: "success", message: "API is working fine."});
});

//All Route Paths

router.use("/user", usersRouter);
router.use("/project", projectsRouter);
router.use("/task", tasksRouter);

module.exports = router;
