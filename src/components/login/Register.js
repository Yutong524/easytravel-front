import React from "react";
import { Button, Form, Input, message } from "antd";
import { LockFilled, UserOutlined } from "@ant-design/icons";
import axios from 'axios';
import "./Login.css"; 
import withNavigation from './withNavigation';

class Register extends React.Component {
  state = {
    loading: false,
  };

  onFinish = (data) => {
    this.setState({
      loading: true,
    });
    axios.post('http://localhost:8080/api/customers/', data)
      .then(response => {
        message.success(`Registration Successful`);
        this.setState({
          loading: false,
        });
        this.props.navigate('/');
      })
      .catch(error => {
        this.setState({
          loading: false,
        });
        if (error.response && error.response.data && error.response.data.message) {
          message.error(`Registration Failed: ${error.response.data.message}`);
        } else {
          message.error(`Registration Failed: ${error.message}`);
        }
      });
  };

  validatePasswords = (_, value) => {
    const { getFieldValue } = this.formRef.current;
    if (value && value !== getFieldValue("password")) {
      return Promise.reject(new Error("The two passwords do not match!"));
    }
    return Promise.resolve();
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
            name="register"
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
              hasFeedback
            >
              <Input.Password prefix={<LockFilled />} placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your Password!" },
                { validator: this.validatePasswords },
              ]}
            >
              <Input.Password prefix={<LockFilled />} placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item>
              <div className="form-buttons">
                <Button type="primary" htmlType="submit" loading={this.state.loading}>
                  Register
                </Button>
                <Button htmlType="button" onClick={this.onReset}>
                  Reset
                </Button>
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ textAlign: 'center', color: 'white' }}>
                Already have an account? <a onClick={() => this.props.navigate('/')}>Login</a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  };
}

export default withNavigation(Register);
