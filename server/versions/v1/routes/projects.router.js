const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');
const {checkToken} = require("../../../utils/jwt");

router.post("/",checkToken, projectsController.addProject);
router.put("/",checkToken, projectsController.updateProject);
router.delete("/",checkToken, projectsController.deleteProject);
router.get("/",checkToken, projectsController.getProjects);

module.exports = router;
