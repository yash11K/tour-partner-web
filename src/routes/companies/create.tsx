import React, { useCallback,useState } from 'react';

import { Create } from '@refinedev/antd';
import {useCreate } from '@refinedev/core';
import { HttpError } from '@refinedev/core';

import { ExclamationCircleOutlined,MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, message, Modal, Row, Space,Switch } from 'antd';
import { Rule } from 'antd/es/form';


interface NewOrganizationModalProps {
  visible: boolean;
  onCancel: () => void;
}

interface OrganizationFormValues {
  name: string;
  display_name: string;
  logo: string;
  avis: boolean;
  budget: boolean;
  metadataFields: { key: string; value: string }[];
}

export const NewOrganizationModal: React.FC<NewOrganizationModalProps> = ({
  visible,
  onCancel,
}) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [showAvisLogo, setShowAvisLogo] = useState(false);
  const [showBudgetLogo, setShowBudgetLogo] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [form] = Form.useForm();

  const { mutate: createOrganizationMutate, isLoading } = useCreate({
    resource: 'organizations',
  });

  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  const clearForm = useCallback(() => {
    form.resetFields();
    setLogoUrl('');
    setShowAvisLogo(false);
    setShowBudgetLogo(false);
    setIsFormDirty(false);
  }, [form]);

  const handleCancel = useCallback(() => {
    if (isFormDirty) {
      Modal.confirm({
        title: 'Unsaved Changes',
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        content: 'You have unsaved changes. Are you sure you want to close this modal?',
        onOk: () => {
          clearForm();
          onCancel();
        },
        okText: 'Yes, close',
        cancelText: 'No, keep editing',
        okButtonProps: {
          danger: true,
        },
        cancelButtonProps: {
          type: 'primary',
        },
        maskClosable: false,
        centered: true,
        className: 'unsaved-changes-modal',
        bodyStyle: { paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20 },
      });
    } else {
      clearForm();
      onCancel();
    }
  }, [isFormDirty, clearForm, onCancel]);

  const handleFinish = async (values: OrganizationFormValues) => {
    const metadata: Record<string, string> = {
      Avis: values.avis ? "true" : "false",
      Budget: values.budget ? "true" : "false",
    };

    values.metadataFields?.forEach(({ key, value }) => {
      if (key && value) {
        metadata[key] = value;
      }
    });

    const transformedValues = {
      name: values.name,
      displayName: values.display_name,
      logo: values.logo,
      metadata,
    };

    createOrganizationMutate(
      {
        resource: "organizations",
        values: transformedValues,
        successNotification: (data, value, resource) => {
          return {
            message: `Success!`,
            description: `${data?.data?.name} Registered`,
            type: "success",
          };
        },
        errorNotification: (error, value, resource) => {
          let errorMessage = "An error occurred while creating the organization.";
          const fieldErrors: { [key: string]: string } = {};

          if (error && 'response' in error) {
            const responseData = error.response?.data;
            if (error.response?.status === 409) {
              errorMessage = "Organization already exists.";
            } else if (typeof responseData?.message === 'string') {
              errorMessage = responseData.message;
              const errors = responseData.message.split('. (also) ');
              errors.forEach((err: string) => {
                const match = err.match(/Payload validation error: '(.+)' on property (.+)/);
                if (match) {
                  const [, validationError, property] = match;
                  const fieldName = property.split(' ')[0].split('.').pop() || "";
                  fieldErrors[fieldName] = getFieldErrorMessage(fieldName);
                }
              });
            }
          }

          // Set form field errors
          const formErrors = Object.entries(fieldErrors).map(([field, error]) => ({
            name: field,
            errors: [error],
          }));
          form.setFields(formErrors);

          return {
            message: `Error ${error?.response?.status || ''}!`,
            description: errorMessage,
            type: "error",
          };
        },
      },
      {
        onSuccess: () => {
          clearForm();
          onCancel();
        },
        onError: (error) => {
          // Handle any additional error actions if needed
        },
      },
    );
  };

  const getFieldErrorMessage = (fieldName: string): string => {
    switch (fieldName) {
      case 'name':
        return 'Name should be all lowercase, dash-separated, no spaces, and less than 30 characters.';
      case 'display_name':
        return 'Display name should be less than 50 characters with no special characters. Single spacing recommended.';
      case 'logo':
        return 'Logo URL should be a valid URL pointing to an image.';
      default:
        return 'Invalid input. Please check the field requirements.';
    }
  };

  return (
    <Modal
      title="Register New Partner"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      maskClosable={false}
      closable={true}
      style={{ padding: '24px 32px' }}
      className="new-organization-modal"
    >
      <Create
        saveButtonProps={{
          onClick: () => {
            form.submit();
          },
          loading: isLoading,
        }}
      >
        <Form 
          form={form}
          layout="vertical" 
          onValuesChange={handleFormChange}
          onFinish={handleFinish as (values: any) => Promise<void>}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: 'Please enter the name' },
                  { 
                    pattern: /^[a-z0-9-]{1,30}$/, 
                    message: 'Name should be all lowercase, dash-separated, no spaces, and less than 30 characters.'
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="display_name"
                label="Display Name"
                rules={[
                  { required: true, message: 'Please enter the display name' },
                  { max: 50, message: 'Display name should be less than 50 characters.' },
                  { 
                    pattern: /^[a-zA-Z0-9 ]+$/, 
                    message: 'Display name should contain only alphanumeric characters and spaces.'
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="logo"
                label="Logo URL"
                rules={[
                  { 
                    type: 'url', 
                    message: 'Please enter a valid URL'
                  }
                ]}
              >
                <Input onChange={(e) => setLogoUrl(e.target.value)} />
              </Form.Item>
              <Form.Item
                name="avis"
                label="Avis"
                valuePropName="checked"
                initialValue={false}
              >
                <Space>
                  <Switch onChange={(checked) => setShowAvisLogo(checked)} />
                  {showAvisLogo && (
                    <Image
                      src="/public/Avis_red.png"
                      alt="Avis logo"
                      width={40}
                      preview={false}
                    />
                  )}
                </Space>
              </Form.Item>
              <Form.Item
                name="budget"
                label="Budget"
                valuePropName="checked"
                initialValue={false}
              >
                <Space>
                  <Switch onChange={(checked) => setShowBudgetLogo(checked)} />
                  {showBudgetLogo && (
                    <Image
                      src="/public/Budget_white.png"
                      alt="Budget logo"
                      width={40}
                      preview={false}
                    />
                  )}
                </Space>
              </Form.Item>
              <Form.Item
                dependencies={['avis', 'budget']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!getFieldValue('avis') && !getFieldValue('budget')) {
                        return Promise.reject('Either Avis or Budget must be selected');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <div style={{ color: 'red' }}>Either Avis or Budget must be selected</div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <h4>Logo Preview</h4>
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Logo preview"
                    style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: 200, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Please enter a logo URL to preview!
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Form.List name="metadataFields">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item
                    key={key}
                    required={false}
                    style={{ marginBottom: 8 }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please input metadata key or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="Metadata Key" style={{ width: '45%' }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please input metadata value or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="Metadata Value" style={{ width: '45%', marginLeft: 8 }} />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ margin: '0 8px' }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  >
                    Add Metadata Field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Create>
    </Modal>
  );
};
