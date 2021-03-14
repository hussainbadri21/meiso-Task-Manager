const projectsModel = require("../models/projects.model");

const addProject = async (data) => {
    const project = new projectsModel(data);
    return await project.save();
}

const updateProject = async (data) => {
    let query = {}
    if (data.p_name !== undefined)
        query['p_name'] = data.p_name
    if (data.desc !== undefined)
        query['desc'] = data.desc
    if (data.duration !== undefined)
        query['duration'] = data.duration
    if (data.img !== undefined)
        query['img'] = data.img

    return projectsModel.findOneAndUpdate({uid: data.uid, pid: data.pid}, {$set: query}, {returnOriginal: false});
}

const deleteProject = async (data) => {
    return projectsModel.deleteOne({uid: data.uid, pid: data.pid});
}

const getProjects = async (data) => {
    let query = {status: 1}
    if (data.pid !== undefined)
        query['pid'] = data.pid

    return projectsModel.find(query, {_id: 0, uid: 0})
}


module.exports = {
    addProject,
    updateProject,
    deleteProject,
    getProjects
};
