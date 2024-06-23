import React from 'react';
import { Button, Form, Input, message, Typography, Layout } from "antd";
import { LockFilled, UserOutlined } from "@ant-design/icons";
import axios from 'axios';
import './Login.css';  

class Login extends React.Component {
  state = {
    loading: false,
  };

  onFinish = (data) => {
    this.setState({
      loading: true,
    });
    axios.post('http://localhost:8080/api/customers/login', data)
    .then(response => {
        localStorage.setItem('customer', JSON.stringify(response.data));
        message.success('Login Successful');
        this.props.onSuccess(); 
      this.setState({
        loading: false,
      });
    })
    .catch(error => {
      message.error(`Login Failed: ${error.response ? error.response.data.message : error.message}`);
      this.setState({
        loading: false,
      });
    });
  };

  onReset = () => {
    this.formRef.current.resetFields();
  };

  formRef = React.createRef();

  render = () => {
    return (
      <div className="login-container">
        <header className="login-header">
          <h1>EasyTravel</h1>
        </header>
        <div className="login-form-container">
          <Form
            name="normal_login"
            onFinish={this.onFinish}
            ref={this.formRef}
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "You have to input your Username!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "You have to input your Password!" }]}
            >
              <Input.Password prefix={<LockFilled />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <div className="form-buttons">
                <Button type="primary" htmlType="submit" loading={this.state.loading}>
                  Login
                </Button>
                <Button htmlType="button" onClick={this.onReset}>
                  Reset
                </Button>
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ textAlign: 'center',color:'white' }}>
                Don't have an account? <a onClick={() => this.props.onRegister()}>Register</a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  };
}

export default Login;
