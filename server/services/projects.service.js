const projectsRepo = require('../repositories/projects.repository');
const {v4: uuidv4} = require('uuid');
const aws = require("aws-sdk");
const keys = require("../config/keys");

const addProject = async (params) => {
    if (params.uid !== undefined) {
        params.pid = uuidv4();
        params.status = 1;
        if (params.img && params.img !== '') {
            const extension = params.img.match(/[^:/]\w+(?=;|,)/)[0]
            const fileName = params.pid + "." + extension
            const img = params.img
            params.img = `https://hmc-projects.s3.ap-south-1.amazonaws.com/${fileName}`
            await uploadAvatarPicture({fileName: fileName, file: img, extension: extension})

        }
        const response = await projectsRepo.addProject(params)
        if (response) {
            return {
                status: 1,
                message: "Project created Successfully.",
                project: response
            }
        } else {
            return {status: 0, message: "Project could not be created"};
        }
    } else {
        return {
            status: 2,
            message: "Required parameters not sent!"
        };
    }
}

const uploadAvatarPicture = async (data) => {
    // Create file name
    const fileName = data.fileName;

    // Setting up S3 upload parameters
    let s3Bucket = new aws.S3({
        accessKeyId: keys.aws.accessKeyId,
        secretAccessKey: keys.aws.secretAccessKey,
        region: "ap-south-1",
    });
    const type = data.file.split(';')[0].split('/')[1];
    const base64Data = new Buffer.from(data.file.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    s3Bucket.upload(
        {
            Bucket: 'hmc-projects',
            Key: fileName,
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
        },
        function (err, data) {
            return {
                status: 1,
                message: "Image successfully uploaded."
            }
        })

};

const updateProject = async (params) => {
    if (params.uid !== undefined && params.pid !== undefined) {
        if (params.img && params.img !== '' && !params.img.includes('hmc-projects.s3')) {
            const extension = params.img.match(/[^:/]\w+(?=;|,)/)[0]
            const fileName = params.pid + "." + extension
            const img = params.img
            params.img = `https://hmc-projects.s3.ap-south-1.amazonaws.com/${fileName}`
            await uploadAvatarPicture({fileName: fileName, file: img, extension: extension})
        }
        const response = await projectsRepo.updateProject(params)
        if (response) {
            return {
                status: 1,
                message: "Project updated Successfully.",
                project: response
            }
        } else {
            return {status: 0, message: "Project could not be updated"};
        }
    } else {
        return {
            status: 2,
            message: "Required parameters not sent!"
        };
    }
}


const deleteProject = async (params) => {
    if (params.uid !== undefined && params.pid !== undefined) {
        const response = await projectsRepo.deleteProject(params)
        if (response) {
            return {
                status: 1,
                message: "Project deleted Successfully."
            }
        } else {
            return {status: 0, message: "Project could not be deleted"};
        }
    } else {
        return {
            status: 2,
            message: "Required parameters not sent!"
        };
    }
}

const getProjects = async (params) => {
    if (params.uid !== undefined) {
        const response = await projectsRepo.getProjects(params)
        if (response) {
            return {
                status: 1,
                message: "Projects fetched Successfully.",
                projects: response
            }
        } else {
            return {status: 0, message: "Projects could not be fetched"};
        }
    } else {
        return {
            status: 2,
            message: "Required parameters not sent!"
        };
    }
}


module.exports = {
    addProject,
    updateProject,
    deleteProject,
    getProjects
};
