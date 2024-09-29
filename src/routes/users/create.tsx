import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Avatar } from 'antd';
import { useCreate, useList } from '@refinedev/core';
import { UserOutlined, MailOutlined, PictureOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { phoneNumberValidator } from '@/utilities';
import { debounce } from 'lodash';
import axios from 'axios';

interface CreateAgentModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  orgId: string;
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 24px 24px 0;
  }
  .ant-modal-body {
    padding: 24px;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-weight: 500;
  }
  .ant-input-prefix {
    color: #bfbfbf;
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
`;

const PhoneNumberInput = styled.div`
  .react-tel-input .form-control {
    width: 100%;
    height: 32px;
    padding-left: 48px;
  }
  .react-tel-input .flag-dropdown {
    border: none;
    background-color: transparent;
  }
`;

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ visible, onCancel, onSuccess, orgId }) => {
  const [form] = Form.useForm();
  const { mutate, isLoading } = useCreate();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    updateAvatarUrl();
  }, []);

  const updateAvatarUrl = () => {
    const firstName = form.getFieldValue('given_name') || '';
    const lastName = form.getFieldValue('family_name') || '';
    const name = `${firstName} ${lastName}`.trim();
    setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`);
  };

  const debouncedUpdateAvatarUrl = debounce(updateAvatarUrl, 300); // 300ms delay

  const handleSubmit = (values: any) => {
    mutate(
      {
        resource: `tours/${orgId}/admins`,
        values: {
          given_name: values.given_name,
          family_name: values.family_name,
          phone_number: phoneNumber,
          email: values.email,
          picture: values.picture || undefined,
        },
        successNotification: (data, value, resource) => {
          return {
            message: `Success!`,
            description: `${data?.data?.name} Registered`,
            type: "success" as const,
          };
        },
      },
      {
        onSuccess: async () => {
          form.resetFields();
          setIsFormDirty(false);
          setPhoneNumber('');
          onSuccess(); // Call the onSuccess callback
        },
      }
    );
  };

  const handleCancel = () => {
    if (isFormDirty) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to close this form?',
        okText: 'Yes, Close',
        cancelText: 'No, Stay',
        onOk: () => {
          form.resetFields();
          setPhoneNumber('');
          setIsFormDirty(false);
          onCancel();
        },
      });
    } else {
      onCancel();
    }
  };

  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  return (
    <StyledModal
      title="Create New Agent"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={400}
    >
      <StyledForm 
        form={form} 
        onFinish={handleSubmit} 
        layout="vertical"
        onValuesChange={handleFormChange}
      >
        <div style={{ textAlign: 'center' }}>
          <StyledAvatar src={avatarUrl} icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>} />
        </div>
        <Form.Item
          name="given_name"
          label="First Name"
          rules={[{ required: true, message: 'Please input the first name' }]}
        >
          <Input
            prefix={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            placeholder="Enter first name"
            onChange={(e) => {
              debouncedUpdateAvatarUrl();
              handleFormChange();
            }}
          />
        </Form.Item>
        <Form.Item
          name="family_name"
          label="Last Name"
          rules={[{ required: true, message: 'Please input the last name' }]}
        >
          <Input
            prefix={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            placeholder="Enter last name"
            onChange={() => {
              debouncedUpdateAvatarUrl();
              handleFormChange();
            }}
          />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please input the phone number' },
            { validator: (_, value) => phoneNumberValidator(_, phoneNumber) }
          ]}
        >
          <PhoneNumberInput>
            <PhoneInput
              country={'us'}
              value={phoneNumber}
              onChange={(phone) => {
                setPhoneNumber(`+${phone}`);
                handleFormChange();
              }}
              inputProps={{
                name: 'phone',
                required: true,
                autoFocus: true
              }}
            />
          </PhoneNumberInput>
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input the email' },
            { type: 'email', message: 'Please input a valid email' }
          ]}
        >
          <Input prefix={<MailOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} placeholder="Enter email" />
        </Form.Item>
        <Form.Item name="picture" label="Picture URL">
          <Input
            prefix={<PictureOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            placeholder="Enter picture URL"
            onChange={(e) => setAvatarUrl(e.target.value || avatarUrl)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Create Agent
          </Button>
        </Form.Item>
      </StyledForm>
    </StyledModal>
  );
};

export default CreateAgentModal;


