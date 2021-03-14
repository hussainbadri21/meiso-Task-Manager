const mongoose = require("mongoose");
const {con_pj} = require("../config/connection.mongo");
const Schema = mongoose.Schema;
mongoose.pluralize(null);

const tasksHistorySchema = new Schema(
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
        uid: {
            type: String,
            required: true
        }
    },
    {versionKey: false}
);

module.exports = Tasks = con_pj.model("tasks_history", tasksHistorySchema);
