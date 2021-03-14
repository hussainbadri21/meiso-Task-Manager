const projectsService = require("../../../services/projects.service");


const addProject= async (req, res) => {
    try {
        const params = req.params;
        const bodyParams = req.body;
        const token = req.token;
        const response = await projectsService.addProject({...params, ...bodyParams,...token});
        return res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e.message);
    }
};

const updateProject= async (req, res) => {
    try {
        const params = req.params;
        const bodyParams = req.body;
        const token = req.token;
        const response = await projectsService.updateProject({...params, ...bodyParams,...token});
        return res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e.message);
    }
};

const deleteProject= async (req, res) => {
    try {
        const params = req.params;
        const bodyParams = req.body;
        const queryPrams = req.query;
        const token = req.token;
        const response = await projectsService.deleteProject({...params, ...bodyParams,...queryPrams,...token});
        return res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e.message);
    }
};

const getProjects = async (req, res) => {
    try {
        const params = req.params;
        const bodyParams = req.body;
        const token = req.token;
        const queryPrams = req.query;
        const response = await projectsService.getProjects({...params, ...bodyParams, ...queryPrams,...token});
        return res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e.message);
    }
};


module.exports = {
    addProject,
    updateProject,
    deleteProject,
    getProjects
};
