const tasksModel = require("../models/tasks.model");
const tasksHistoryModel = require("../models/tasksHistory.model");
const {getTimestamp} = require("../utils/common.util");

const addTask = async (data) => {
    const task = new tasksModel(data);
    return await task.save();
    const tasksHistory = new tasksHistoryModel(data);
    return await tasksHistory.save();
}

const updateTask = async (data) => {
    let query = {}
    if (data.t_name !== undefined && data.t_name.length > 0)
        query['t_name'] = data.t_name
    if (data.desc !== undefined && data.desc.length > 0)
        query['desc'] = data.desc
    if (data.sdt !== undefined && data.sdt !== null)
        query['sdt'] = data.sdt
    if (data.edt !== undefined && data.edt !== null)
        query['edt'] = data.edt

    query['last_updated'] = getTimestamp()

    const tasksHistory = new tasksHistoryModel({...data, ...query});
    await tasksHistory.save();

    return tasksModel.findOneAndUpdate({pid: data.pid, tid: data.tid}, {$set: query}, {returnOriginal: false});
}

const deleteTask = async (data) => {
    await tasksHistoryModel.deleteMany({pid: data.pid, tid: data.tid});
    return tasksModel.deleteOne({pid: data.pid, tid: data.tid});
}

const getTasks = async (data) => {
    let query = {pid: data.pid}
    if (data.tid !== undefined)
        query['tid'] = data.tid

    return tasksModel.find(query, {_id: 0, uid: 0})
}


module.exports = {
    addTask,
    updateTask,
    deleteTask,
    getTasks
};
