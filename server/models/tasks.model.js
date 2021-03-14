const mongoose = require("mongoose");
const {con_pj} = require("../config/connection.mongo");
const Schema = mongoose.Schema;
mongoose.pluralize(null);

const tasksSchema = new Schema(
    {
        tid: {
            type: String,
            required: true
        },
        pid: {
            type: String,
            required: true
        },
        t_name: {
            type: String,
        },
        desc: {
            type: String,
        },
        sdt: {
            type: Number,
        },
        edt: {
            type: Number,
        },
        last_updated: {
            type: Number,
        },
        uid: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            required: true
        },
    },
    {versionKey: false}
);

module.exports = Tasks = con_pj.model("tasks", tasksSchema);
