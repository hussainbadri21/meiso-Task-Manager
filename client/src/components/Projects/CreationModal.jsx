import {Button, Form, Input, Modal, Upload, Icon, message} from "antd";
import React, {Component} from 'react';
import {G_API_URL, G_COOKIE_NAME} from "../../constants/constants";
import axios from "axios";
import queryString from "query-string";
import {__getCookie} from "../../utils/cookie.util";
import {connect} from "react-redux";


class ProjectCreationModal extends Component {

    state = {
        img: '',
        fileList: []
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {img} = this.state;
        const {modalhandleClose, projectData, mode} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.img = img
                if (mode === 'update2') {
                    values.pid = projectData.pid
                    axios.put(G_API_URL + 'project', values, {
                        headers: {
                            "Authorization": __getCookie(G_COOKIE_NAME).cookieValue
                        }
                    })
                        .then((res) => {
                            res = res.data;
                            if (res.status === 1) {
                                message.success(res.message)
                                this.setState({img: '', fileList: []})
                                this.props.updateProject({...res.project});
                                modalhandleClose();
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else {
                    axios.post(G_API_URL + "project", queryString.stringify(values), {
                        headers: {
                            "Authorization": __getCookie(G_COOKIE_NAME).cookieValue
                        }
                    })
                        .then(res => {
                            res = res.data;
                            if (res.status === 1) {
                                message.success(res.message)
                                this.setState({img: '', fileList: []})
                                this.props.addProject({...res.project});
                                modalhandleClose();
                            } else {
                                message.error(res.message)
                            }
                        }).catch(err => {
                        console.log(err);
                    })

                }
            }
        });
    }

    componentDidUpdate() {
        const {projectData, mode} = this.props;
        if (mode === 'update') {
            if (projectData && Object.keys(projectData).length > 0) {
                this.setState({
                    img: projectData.img.length > 0 ? projectData.img : 'https://hmc-projects.s3.ap-south-1.amazonaws.com/default_bg.jpg',
                    fileList: [{
                        uid: '-1',
                        name: 'default.png',
                        status: 'done',
                        url: projectData.img.length > 0 ? projectData.img : 'https://hmc-projects.s3.ap-south-1.amazonaws.com/default_bg.jpg',
                    }]
                })
            }
            this.props.changeMode('update2')
            this.props.form.setFieldsValue({
                p_name: projectData.p_name,
                desc: projectData.desc,
                duration: projectData.duration,
            });
        }
    }


    render() {
        const {modalVisible, modalhandleClose, mode} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {img, fileList} = this.state;
        return (
            <>
                <Modal
                    className="confirm-payment-modal"
                    footer={null}
                    centered
                    destroyOnClose={true}
                    visible={modalVisible}
                    onCancel={() => {
                        this.setState({img: '', fileList: []})
                        modalhandleClose();
                    }}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <div className="form-block">
                            <Form.Item label="Project Name">
                                {getFieldDecorator('p_name', {
                                    rules: [{
                                        required: true,
                                        message: 'Project Name cannot be empty!'
                                    }],
                                })(
                                    <Input type="text" placeholder="Enter Project Name"/>
                                )}
                            </Form.Item>
                        </div>
                        <div className="form-block">
                            <Form.Item label="Project Description">
                                {getFieldDecorator('desc')(
                                    <Input type="text" placeholder="Enter Project Description"/>
                                )}
                            </Form.Item>
                        </div>
                        <div className="form-block">
                            <Form.Item label="Project Duration">
                                {getFieldDecorator('duration')(
                                    <Input type="text" placeholder="Enter Project Duration"/>
                                )}
                            </Form.Item>
                        </div>
                        <Upload
                            accept="image/*"
                            fileList={fileList}
                            listType='picture-card'
                            onRemove={() => {
                                this.setState({img: ''})
                            }}
                            beforeUpload={file => {
                                const reader = new FileReader();
                                reader.readAsDataURL(file)
                                reader.onload = e => {
                                    this.setState({img: e.target.result});
                                };
                                return false;
                            }}
                            onChange={({fileList}) => {
                                this.setState({fileList})
                            }}
                        >
                            {img === '' && <Button>
                                <Icon type="upload"/> Upload Project Avatar
                            </Button>}
                        </Upload>
                        <Button
                            className="login-form-btn default-btn filled-blue"
                            type="primary"
                            htmlType="submit"
                            // loading={this.state.loading}
                        >
                            {`${mode === 'update' || mode === 'update2' ? 'Update Project' : 'Create Project'}`}
                        </Button>
                    </Form>
                </Modal>
                <style jsx={'true'}>
                    {`
                      @media only screen and (max-device-width: 760px) {
                      }
                    `}
                </style>
            </>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        projects: state.projects,
        mode: state.mode
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProject: (value) => {
            dispatch({type: 'ADD_PROJECT', payload: value})
        },
        updateProject: (value) => {
            dispatch({type: 'UPDATE_PROJECT', payload: value})
        },
        changeMode: (value) => {
            dispatch({type: 'CHANGE_PROJECT_EDIT_MODE', payload: value})
        }
    }
}

const ProjectDataForm = Form.create({name: ""})(ProjectCreationModal);
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDataForm);
