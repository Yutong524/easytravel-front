import React from 'react';
import { Button, Form, Input, message } from "antd";
import { LockFilled, UserOutlined } from "@ant-design/icons";
import axios from 'axios';
import './Login.css';  
import withNavigation from './withNavigation';

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
        if (error.response) {
          if (error.response.status === 500) {
            message.error('Wrong Credential. Please check your username or password.');
          } else if (error.response.data && error.response.data.message) {
            message.error(`Login Failed: ${error.response.data.message}`);
          } else {
            message.error(`Login Failed: ${error.response.statusText}`);
          }
        } else {
          message.error(`Login Failed: ${error.message}`);
        }
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
              <div style={{ textAlign: 'center', color: 'white' }}>
                Don't have an account? <a onClick={() => this.props.navigate('/register')}>Register</a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  };
}

export default withNavigation(Login);
