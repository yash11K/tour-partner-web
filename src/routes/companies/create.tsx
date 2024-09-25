import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, message, Button, Row, Col, Image, Space } from 'antd';
import { createOrganization } from './queries';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface NewOrganizationModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const NewOrganizationModal: React.FC<NewOrganizationModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [logoUrl, setLogoUrl] = useState('');
  const [showAvisLogo, setShowAvisLogo] = useState(false);
  const [showBudgetLogo, setShowBudgetLogo] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    form.setFields([]);
    setLogoUrl('');
    setShowAvisLogo(false);
    setShowBudgetLogo(false);
    setIsFormDirty(false);
  }, [visible]);

  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  const handleCancel = () => {
    if (isFormDirty) {
      Modal.confirm({
        title: 'Unsaved Changes',
        icon: <ExclamationCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        content: 'You have unsaved changes. Are you sure you want to close this modal?',
        onOk: () => {
          clearForm();
          onCancel();
        },
      });
    } else {
      clearForm();
      onCancel();
    }
  };

  const clearForm = () => {
    form.resetFields();
    setLogoUrl('');
    setShowAvisLogo(false);
    setShowBudgetLogo(false);
    setIsFormDirty(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const metadata: Record<string, string> = {};

      // Only add avis and budget to metadata if they are defined
      if (values.avis !== undefined) {
        metadata.avis = values.avis.toString();
      }
      if (values.budget !== undefined) {
        metadata.budget = values.budget.toString();
      }

      // Add custom metadata fields
      values.metadataFields?.forEach(({ key, value }: { key: string; value: string }) => {
        if (key && value) {
          metadata[key] = value;
        }
      });

      const newOrganization = {
        name: values.name,
        displayName: values.displayName,
        logo: values.logo,
        metadata,
      };

      await createOrganization(newOrganization);
      message.success('Organization created successfully');
      clearForm();
      onSuccess();
    } catch (error) {
      console.error('Failed to create organization:', error);
      message.error('Failed to create organization');
    }
  };

  return (
    <Modal
      title="Register New Partner"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={800}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter the name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="displayName"
              label="Display Name"
              rules={[{ required: true, message: 'Please enter the display name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="logo"
              label="Logo URL"
              rules={[{ required: true, message: 'Please enter the logo URL' }]}
            >
              <Input onChange={(e) => setLogoUrl(e.target.value)} />
            </Form.Item>
            <Form.Item name="avis" label="Avis" valuePropName="checked" initialValue={false}>
              <Space>
                <Switch onChange={(checked) => setShowAvisLogo(checked)} />
                {showAvisLogo && (
                  <Image
                    src="/public/avis.com.png"
                    alt="Avis logo"
                    width={40}
                    preview={false}
                  />
                )}
              </Space>
            </Form.Item>
            <Form.Item name="budget" label="Budget" valuePropName="checked" initialValue={false}>
              <Space>
                <Switch onChange={(checked) => setShowBudgetLogo(checked)} />
                {showBudgetLogo && (
                  <Image
                    src="/public/budget.com.png"
                    alt="Budget logo"
                    width={40}
                    preview={false}
                  />
                )}
              </Space>
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
                  No logo URL provided
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
                    style={{ margin: '0 8px' }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  />
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
    </Modal>
  );
};