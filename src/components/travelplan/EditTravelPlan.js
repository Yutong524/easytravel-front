import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Button, Space, Tag, message } from 'antd';
import axios from 'axios';

const EditTravelPlan = ({ visible, onClose, onEdit, plan}) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState(plan.tags);
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
    console.log(values)
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
      title="Edit Travel Plan"
      open={visible}
      onCancel={onClose}
      className="edit-travel-plan-modal"
      destroyOnClose={true}
      footer={null}
    >
      <Form
        form={form}
        initialValues={plan}
        layout="vertical"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item
          name="name"
          label="Plan Name"
          rules={[{ required: true, message: 'Please input your plan name!' }]}
        >
          <Input />
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
          <Input.TextArea />
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

export default EditTravelPlan;
