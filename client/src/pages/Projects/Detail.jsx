import React, {Component} from "react";
import {connect} from "react-redux";
import {__getCookie, check_login} from "../../utils/cookie.util";
import {G_COOKIE_NAME, G_URL} from "../../constants/constants";
import axios from "axios";
import * as Constants from "../../constants/constants";
import Navbar from "../../components/header/Navbar";
import default_bg from '../../assets/default_bg.jpg'
import {Button, Icon, message} from "antd";
import ProjectDataForm from "../../components/Projects/CreationModal";
import TaskDataForm from "../../components/Tasks/CreationModal";
import Card from "../../components/Tasks/Card";
import {Link} from "react-router-dom";
import EmptyState from "../../components/EmptyState/EmptyState";

class Detail extends Component {

    state = {}

    componentDidMount() {
        if (check_login()) {
            this.getTasks();
        } else {
            window.location.href = G_URL;
        }
    }

    getTasks = () => {
        axios.get(Constants.G_API_URL + 'task', {
            headers: {
                "Authorization": __getCookie(G_COOKIE_NAME).cookieValue
            },
            params: {
                pid: this.props.match.params.id
            }
        })
            .then((res) => {
                res = res.data;
                if (res.status === 1) {
                    this.setState({project_data: res.project_data})
                    this.props.setTasks({...res.tasks});
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    renderTasks = () => {
        const pid = this.props.match.params.id
        return Object.values(this.props.tasks).map((task) => {
            return (
                <Link to={`${pid}/task/${task.tid}`}>
                    <Card task={task} pid={pid} fromPage='project_detail'/>
                </Link>)
        })
    }


    render() {
        let {projects} = this.props
        let {project_data} = this.state
        const {modalVisible, taskModalVisible} = this.props;
        return (
            <>
                <Navbar/>
                {project_data && <div className='bg-image project-image f-d f-h-c f-v-c f-vt'
                                      style={{backgroundImage: `url(${project_data.img.length > 0 ? project_data.img : default_bg})`}}>
                    <div className='h1-heading pname'>{project_data.p_name}</div>
                    <div className='body-regular pdesc'>{project_data.desc}</div>
                    <Icon type="edit" key="edit"
                          onClick={(e) => {
                              e.preventDefault()
                              this.props.changeMode('update');
                              this.props.changeModalVisibility(true);
                              this.setState({
                                  projectData: project_data
                              })
                          }}/>,
                </div>}
                <div className="body-container">
                    {!this.props.tasks || Object.keys(this.props.tasks).length === 0 ?
                        <EmptyState type='task'/> :
                        <div className='g-d g-col-4'>
                            {this.renderTasks()}
                        </div>}
                    <ProjectDataForm modalVisible={modalVisible} projectData={projects}
                                     modalhandleClose={() => this.props.changeModalVisibility(false)}/>
                    <TaskDataForm modalVisible={taskModalVisible}
                                  pid={this.props.match.params.id}
                                  modalhandleClose={() => this.props.changeTaskModalVisibility(false)}/>
                    <Button onClick={() => {
                        this.props.changeMode('create');
                        this.props.changeTaskModalVisibility(true);
                    }} className='fab'>
                        <Icon style={{fontSize: '18px', color: 'white'}} type="plus"/>
                    </Button>
                </div>
                <style jsx={"true"}>
                    {`
                      .body-container {
                        padding-left: 5rem;
                        padding-right: 5rem;
                        margin-top: 6rem;
                      }

                      .pname, .pdesc {
                        overflow: hidden;
                      }

                      .pname {
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }

                      .project-image {
                        width: 100%;
                        height: 20rem;
                        opacity: 0.7;
                        margin-bottom: 4rem;
                      }

                      .fab {
                        position: fixed;
                        right: 20px;
                        border-radius: 100%;
                        bottom: 20px;
                        width: 60px;
                        height: 60px;
                        border: none;
                        box-shadow: var(--peaky-shadow-high-2);
                        background: var(--bluelagoon);
                      }

                      .fab:active, .fab:focus {
                        background: var(--bluelagoon);
                      }

                      .fab:hover {
                        background: var(--bluemoon);
                      }

                      @media only screen and (max-device-width: 760px) {

                      }


                    `}
                </style>
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        projects: state.projects,
        tasks: state.tasks,
        mode: state.mode,
        modalVisible: state.modalVisible,
        taskModalVisible: state.taskModalVisible,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setTasks: (value) => {
            dispatch({type: 'SET_TASKS', payload: value})
        },
        deleteTask: (value) => {
            dispatch({type: 'DELETE_TASK', payload: value})
        },
        changeMode: (value) => {
            dispatch({type: 'CHANGE_PROJECT_EDIT_MODE', payload: value})
        },
        changeModalVisibility: (value) => {
            dispatch({type: 'CHANGE_PROJECT_MODAL_VISIBILITY', payload: value})
        },
        changeTaskModalVisibility: (value) => {
            dispatch({type: 'CHANGE_TASK_MODAL_VISIBILITY', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
