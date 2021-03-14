import {Button, Form, Input, Modal, DatePicker, message} from "antd";
import React, {Component} from 'react';
import {G_API_URL, G_COOKIE_NAME} from "../../constants/constants";
import axios from "axios";
import queryString from "query-string";
import {__getCookie} from "../../utils/cookie.util";
import {connect} from "react-redux";
import 'antd/dist/antd.css'
import moment from 'moment';


class TaskCreationModal extends Component {

    state = {
        sdt: '',
        edt: ''
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {modalhandleClose, task_data, mode} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.sdt = this.state.sdt
                values.edt = this.state.edt
                values.pid = this.props.pid
                if (mode === 'task_update2') {
                    values.tid = task_data.tid
                    axios.put(G_API_URL + 'task', values, {
                        headers: {
                            "Authorization": __getCookie(G_COOKIE_NAME).cookieValue
                        }
                    })
                        .then((res) => {
                            res = res.data;
                            if (res.status === 1) {
                                message.success(res.message)
                                this.props.updateTask({...res.task});
                                modalhandleClose();
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else {
                    axios.post(G_API_URL + "task", queryString.stringify(values), {
                        headers: {
                            "Authorization": __getCookie(G_COOKIE_NAME).cookieValue
                        }
                    })
                        .then(res => {
                            res = res.data;
                            if (res.status === 1) {
                                message.success(res.message)
                                this.props.addTask({...res.task});
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
        const {task_data, mode} = this.props;
        if (mode === 'task_update') {
            this.props.changeMode('task_update2')
            this.props.form.setFieldsValue({
                t_name: task_data.t_name,
                desc: task_data.desc,
            });
            this.setState({
                sdt: task_data.sdt !== null ? task_data.sdt : '',
                edt: task_data.edt !== null ? task_data.edt : ''
            })
        }
    }


    render() {
        const {modalVisible, modalhandleClose, mode} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {sdt, edt} = this.state;
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
                            <Form.Item label="Task Name">
                                {getFieldDecorator('t_name', {
                                    rules: [{
                                        required: true,
                                        message: 'Task Name cannot be empty!'
                                    }],
                                })(
                                    <Input type="text" placeholder="Enter Task Name"/>
                                )}
                            </Form.Item>
                        </div>
                        <div className="form-block">
                            <Form.Item label="Task Description">
                                {getFieldDecorator('desc')(
                                    <Input type="text" placeholder="Enter Task Description"/>
                                )}
                            </Form.Item>
                        </div>
                        <div className="form-block">
                            <Form.Item
                                label="Start Date"
                                name="sdt"
                            >
                                <DatePicker
                                    defaultValue={sdt !== '' ? moment(sdt * 1000) : ''}
                                    onChange={(date) => {
                                        if (date !== null)
                                            this.setState({sdt: date.unix()})
                                    }}/>
                            </Form.Item>
                        </div>
                        <div className="form-block">
                            <Form.Item
                                label="edt"
                                name="dateOfBirth"
                            >
                                <DatePicker
                                    defaultValue={edt !== '' ? moment(edt * 1000) : ''}
                                    onChange={(date) => {
                                        if (date !== null)
                                            this.setState({edt: date.unix()})
                                    }}/>
                            </Form.Item>
                        </div>


                        <Button
                            className="login-form-btn default-btn filled-blue"
                            type="primary"
                            htmlType="submit"
                            // loading={this.state.loading}
                        >
                            {`${mode === 'task_update' || mode === 'task_update2' ? 'Update Task' : 'Create Task'}`}
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
        task_data: state.task_data,
        mode: state.mode
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addTask: (value) => {
            dispatch({type: 'ADD_TASK', payload: value})
        },
        updateTask: (value) => {
            dispatch({type: 'UPDATE_TASK', payload: value})
        },
        changeMode: (value) => {
            dispatch({type: 'CHANGE_PROJECT_EDIT_MODE', payload: value})
        }
    }
}

const TaskDataForm = Form.create({name: ""})(TaskCreationModal);
export default connect(mapStateToProps, mapDispatchToProps)(TaskDataForm);
