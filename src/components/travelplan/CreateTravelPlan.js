import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Button, Space, Tag, message } from 'antd';
import axios from 'axios';
import './CreateTravelPlan.css';

const CreateTravelPlan = ({ visible, onClose, onCreate, userId }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleAddNewTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      if (tags.length < 5) {
        setTags([...tags, inputValue]);
        setInputValue('');
      } else {
        message.warning('You can only add up to 5 tags.');
      }
    } else if (tags.includes(inputValue)) {
      message.warning('This tag is already added.');
    }
  };

  const onFinish = (values) => {
    if (values.planName.trim()) {
      // const payload = {
      //   name: values.planName,
      //   description: values.description,
      //   tags: tags,
      //   author: userId
      // };
      const tagsString = tags.join(',');
      const payload = `${values.planName};${values.description};1;${tagsString}`;   // dummy id = 1
      // const payload = `${values.planName};${values.description};${userId}`;

      axios.post('http://localhost:8080/api/travelPlans/', payload, {
        headers: {
          'Content-Type': 'text/plain'
        }
      })
        .then(response => {
          if (response.status === 201) {
            message.success('Plan created successfully!');
            onCreate(payload);
            setTags([]);
            form.resetFields();
            onClose();
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 405) {
            message.error('The plan name exists.');
          } else {
            message.error('An error occurred. Please try again.');
          }
        });
    } else {
      form.setFields([{ name: 'planName', errors: [new Error('Please input your plan name!')] }]);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClose = (removedTag) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    inputRef.current.focus();
  };

  useEffect(() => {
    if (inputRef.current && inputValue === '') {
      inputRef.current.blur();
    }
  }, [inputValue, inputRef]);

  return (
    <Modal
      title="Create New Plan"
      open={visible}
      onCancel={onClose}
      className="create-travel-plan-modal"
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="planName"
          label="Plan Name"
          rules={[{ required: true, message: 'Please input your plan name!' }]}
        >
          <Input placeholder="Please input your plan name" />
        </Form.Item>
        <Form.Item label="Tags" className="form-item">
          <div className="tag-input-wrapper">
            {tags.map((tag, index) => (
              <Tag key={index} closable onClose={() => handleClose(tag)}>
                {tag}
              </Tag>
            ))}
            {tags.length < 5 && (
              <Input
                ref={inputRef}
                type="text"
                size="small"
                style={{ width: '200px' }}
                placeholder="Type tag and press Enter"
                value={inputValue}
                onChange={handleInputChange}
                onPressEnter={handleAddNewTag}
              />
            )}
            <Button className="add-new-tag-button" onClick={handleAddNewTag}>
              Add
            </Button>
          </div>
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Please input your plan description" />
        </Form.Item>
        <Form.Item>
          <Space className="button-wrapper">
            <Button type="primary" htmlType="submit" className="create-button">
              Create
            </Button>
            <Button onClick={onClose} className="cancel-button">
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTravelPlan;
