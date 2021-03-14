import React, {Component} from 'react';
import Navbar from "../../components/header/Navbar";
import {Button, message, Icon, Card} from 'antd';
import 'antd/dist/antd.css'
import * as Constants from "../../constants/constants";
import axios from "axios";
import {connect} from 'react-redux';
import {G_URL, G_COOKIE_NAME} from "../../constants/constants";
import {check_login} from "../../utils/cookie.util";
import {__getCookie} from '../../utils/cookie.util'
import EmptyState from "../../components/EmptyState/EmptyState";
import default_bg from '../../assets/default_bg.jpg'
import ProjectDataForm from '../../components/Projects/CreationModal'
import {Link} from "react-router-dom";

const {Meta} = Card;

class Listing extends Component {

    state = {
        projectData: []
    }

    componentDidMount() {
        if (check_login()) {
            this.getProjects();
        } else {
            window.location.href = G_URL;
        }
    }

    getProjects = () => {

        axios.get(Constants.G_API_URL + 'project/', {
            headers: {
                "Authorization": __getCookie(G_COOKIE_NAME).cookieValue
            }
        })
            .then((res) => {
                this.props.changeModalVisibility(false);

                res = res.data;
                if (res.status === 1) {
                    this.props.setProjects({...res.projects});
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    renderProjects = () => {
        return Object.values(this.props.projects).map((project) => {
            return (
                <Link to={`project/${project.pid}`}>
                    <Card
                        hoverable
                        key={project.pid}
                        style={{width: 300}}
                        cover={<img alt="avatar"
                                    src={project.img && project.img.length > 0 ? project.img : default_bg}/>}
                        actions={[
                            <Icon type="edit" key="edit"
                                  onClick={(e) => {
                                      e.preventDefault()
                                      this.props.changeMode('update');
                                      this.props.changeModalVisibility(true);
                                      this.setState({
                                          projectData: project
                                      })
                                  }}/>,
                            <Icon type="delete" key="delete"
                                  onClick={(e) => {
                                      e.preventDefault()
                                      this.deleteProject(project.pid)
                                  }}/>,
                        ]}
                    >
                        <Meta title={project.p_name} description={project.desc}/>
                    </Card>
                </Link>)
        })
    }

    deleteProject = (pid) => {
        axios.delete(Constants.G_API_URL + 'project/', {
            params: {
                pid: pid
            },
            headers: {
                "Authorization": __getCookie(G_COOKIE_NAME).cookieValue
            }
        })
            .then((res) => {
                res = res.data;
                if (res.status === 1) {
                    message.success(res.message);
                    this.props.deleteProject(pid);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {
        const {projectData} = this.state;
        const {modalVisible} = this.props;
        return (
            <>
                <Navbar/>
                {!this.props.projects || Object.keys(this.props.projects).length === 0 ?
                    <EmptyState type='project'/> :
                    <div className="body-container">
                        <div className='g-d g-col-4'>
                            {this.renderProjects()}
                        </div>
                    </div>}

                <ProjectDataForm modalVisible={modalVisible} projectData={projectData}
                                 modalhandleClose={() =>  this.props.changeModalVisibility(false)}/>

                <Button onClick={() => {
                    this.props.changeMode('create');
                    this.props.changeModalVisibility(true);
                }} className='fab'>
                    <Icon style={{fontSize: '18px', color: 'white'}} type="plus"/>
                </Button>

                <style jsx={"true"}>
                    {`
                      body {
                        background: var(--smoke);
                      }

                      .body-container {
                        padding-left: 5rem;
                        padding-right: 5rem;
                        margin-top: 6rem;
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

                      .ant-card {
                        margin: 1rem 0.25rem;
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
        projects: state.projects,
        mode: state.mode,
        modalVisible: state.modalVisible,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setProjects: (value) => {
            dispatch({type: 'SET_PROJECTS', payload: value})
        },
        deleteProject: (value) => {
            dispatch({type: 'DELETE_PROJECT', payload: value})
        },
        changeMode: (value) => {
            dispatch({type: 'CHANGE_PROJECT_EDIT_MODE', payload: value})
        },
        changeModalVisibility: (value) => {
            dispatch({type: 'CHANGE_PROJECT_MODAL_VISIBILITY', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Listing);
