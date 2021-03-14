const mongoose = require("mongoose");
const {con_pj} = require("../config/connection.mongo");
const Schema = mongoose.Schema;
mongoose.pluralize(null);

const projectSchema = new Schema(
    {
        uid: {
            type: String,
            required: true
        },
        pid: {
            type: String,
            required: true
        },
        p_name: {
            type: String,
        },
        desc: {
            type: String,
        },
        duration: {
            type: String,
        },
        img: {
            type: String,
        },
        status: {
            type: Number,
            required: true
        },
    },
    {versionKey: false}
);

module.exports = Project = con_pj.model("projects", projectSchema);
