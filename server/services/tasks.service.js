const tasksRepo = require('../repositories/tasks.repository');
const projectRepo = require('../repositories/projects.repository');
const {getTimestamp} = require("../utils/common.util");
const {v4: uuidv4} = require('uuid');

const addTask = async (params) => {
    if (params.uid !== undefined && params.pid !== undefined) {
        params.last_updated = getTimestamp()
        params.tid = uuidv4();
        params.status = 1;
        const response = await tasksRepo.addTask(params)
        if (response) {
            return {
                status: 1,
                message: "Task added Successfully.",
                task: response
            }
        } else {
            return {status: 0, message: "Task could not be added"};
        }

    } else {
        return {
            status: 2,
            message: "Required parameters not sent!"
        };
    }
}

const updateTask = async (params) => {
    if (params.uid !== undefined && params.tid !== undefined && params.pid !== undefined) {
        const response = await tasksRepo.updateTask(params)
        if (response) {
            return {
                status: 1,
                message: "Task updated Successfully.",
                task:response
            }
        } else {
            return {status: 0, message: "Task could not be updated"};
        }
    } else {
        return {
            status: 2,
            message: "Required parameters not sent!"
        };
    }
}


const deleteTask = async (params) => {
    if (params.uid !== undefined && params.tid !== undefined && params.pid !== undefined) {
        const response = await tasksRepo.deleteTask(params)
        if (response) {
            return {
                status: 1,
                message: "Task deleted Successfully."
            }
        } else {
            return {status: 0, message: "Task could not be deleted"};
        }
    } else {
        return {
            status: 2,
            message: "Required parameters not sent!"
        };
    }
}

const getTasks = async (params) => {
    if (params.uid !== undefined && params.pid !== undefined) {
        const response = await tasksRepo.getTasks(params)
        const project_response = await projectRepo.getProjects(params)
        if (response) {
            return {
                status: 1,
                message: "Tasks fetched Successfully.",
                tasks: response,
                project_data:project_response[0]
            }
        } else {
            return {status: 0, message: "Tasks could not be fetched"};
        }
    } else {
        return {
            status: 2,
            message: "Required parameters not sent!"
        };
    }
}


module.exports = {
    addTask,
    updateTask,
    deleteTask,
    getTasks
};
