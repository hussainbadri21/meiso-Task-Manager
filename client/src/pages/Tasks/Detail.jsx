import React, {Component} from 'react';
import Navbar from "../../components/header/Navbar";
import 'antd/dist/antd.css'
import * as Constants from "../../constants/constants";
import axios from "axios";
import {connect} from 'react-redux';
import {G_URL, G_COOKIE_NAME} from "../../constants/constants";
import {check_login} from "../../utils/cookie.util";
import {__getCookie} from '../../utils/cookie.util'
import Card from '../../components/Tasks/Card'
import TaskDataForm from "../../components/Tasks/CreationModal";


class Detail extends Component {

    state = {
        task: []
    }

    componentDidMount() {
        if (check_login()) {
            this.getTask();
        } else {
            window.location.href = G_URL;
        }
    }


    getTask = () => {
        const {pid, tid} = this.props.match.params
        axios.get(Constants.G_API_URL + 'task', {
            headers: {
                "Authorization": __getCookie(G_COOKIE_NAME).cookieValue
            },
            params: {
                pid: pid,
                tid: tid
            }
        })
            .then((res) => {
                res = res.data;
                if (res.status === 1) {
                    this.setState({task: res.tasks[0]})
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {
        const {task, taskData} = this.state
        const {taskModalVisible} = this.props;
        const {pid} = this.props.match.params
        return (
            <>
                <Navbar/>
                <div className='body-container f-d f-v-c f-h-c'>
                    <Card task={task} pid={pid}/>
                </div>
                <TaskDataForm modalVisible={taskModalVisible} taskData={taskData}
                              pid={this.props.match.params.pid}
                              modalhandleClose={() => {
                                  window.location.reload()
                                  this.props.changeTaskModalVisibility(false)
                              }}/>
                <style jsx={"true"}>
                    {`
                      body {
                        background: var(--smoke);
                      }

                      .body-container {
                        padding-left: 5rem;
                        padding-right: 5rem;
                        margin-top: 16rem;
                      }


                      @media only screen and (max-device-width: 760px) {
                        .body-container {
                          padding-left: 1rem;
                          padding-right: 1rem;
                          margin-top: 6rem;
                        }
                      }

                    `}
                </style>
            </>
        );
    }

}

function mapStateToProps(state, ownProps) {
    return {
        mode: state.mode,
        taskModalVisible: state.taskModalVisible,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeMode: (value) => {
            dispatch({type: 'CHANGE_PROJECT_EDIT_MODE', payload: value})
        },
        changeTaskModalVisibility: (value) => {
            dispatch({type: 'CHANGE_TASK_MODAL_VISIBILITY', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
