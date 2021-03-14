import {Card, Icon, message} from "antd";
import moment from "moment";
import React, {Component} from "react";
import axios from "axios";
import * as Constants from "../../constants/constants";
import {__getCookie} from "../../utils/cookie.util";
import {G_COOKIE_NAME} from "../../constants/constants";
import {connect} from "react-redux";

const {Meta} = Card;

class TaskCard extends Component {
    deleteTask = (pid, tid) => {
        axios.delete(Constants.G_API_URL + 'task', {
            params: {
                pid: pid,
                tid: tid
            },
            headers: {
                "Authorization": __getCookie(G_COOKIE_NAME).cookieValue
            }
        })
            .then((res) => {
                res = res.data;
                if (res.status === 1) {
                    message.success(res.message);
                    this.props.deleteTask(tid);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {
        const {task, pid, fromPage} = this.props
        let actions = [
            <Icon type="edit" key="edit"
                  onClick={(e) => {
                      e.preventDefault()
                      this.props.changeMode('task_update');
                      this.props.changeTaskModalVisibility(true);
                      this.props.setTask(task);
                  }}/>]
        if (fromPage !== undefined && fromPage === 'project_detail')
            actions.push(
                <Icon type="delete" key="delete"
                      onClick={(e) => {
                          e.preventDefault()
                          this.deleteTask(pid, task.tid)
                      }}/>
            )
        return (
            <Card
                hoverable
                key={task.tid}
                style={{width: 300}}
                actions={actions}
            >
                <Meta title={task.t_name} description={task.desc}/>
                {task.sdt !== null &&
                <div className='body-small'>{`Start Date:${moment(task.sdt * 1000).format('DD-MM-YYYY')}`}</div>}
                {task.edt !== null &&
                <div className='body-small'>{`End Date:${moment(task.edt * 1000).format('DD-MM-YYYY')}`}</div>}
            </Card>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        tasks: state.tasks,
        task_data: state.task_data,
        mode: state.mode,
        taskModalVisible: state.taskModalVisible,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteTask: (value) => {
            dispatch({type: 'DELETE_TASK', payload: value})
        },
        setTask: (value) => {
            dispatch({type: 'SET_TASK', payload: value})
        },
        changeMode: (value) => {
            dispatch({type: 'CHANGE_PROJECT_EDIT_MODE', payload: value})
        },
        changeTaskModalVisibility: (value) => {
            dispatch({type: 'CHANGE_TASK_MODAL_VISIBILITY', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskCard);
