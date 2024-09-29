import React, { useState, useEffect } from "react";
import { useShow, useList } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Button } from "antd";
import { ArrowLeftOutlined, UserAddOutlined } from "@ant-design/icons";
import { CompanyInfoForm } from "./components/info-form";
import { UserTable } from "./components/user-table";
import { Organization } from "@/rest-api/types";
import { CompanyTitleForm } from "./components";
import CreateAgentModal from "../users/create";
import { Form } from 'antd';
import { useUpdateOrganization } from '@/hooks/useUpdateOrganization';

export const CompanyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { queryResult } = useShow<Organization>({
    resource: "organizations",
    id: id,
  });
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | undefined>(undefined);

  useEffect(() => {
    if (queryResult.data?.data) {
      const org = queryResult.data.data;
      setOrganization({
        ...org,
        metadata: {
          ...org.metadata,
          isBlocked: org.metadata?.isBlocked?.toString() || "false"
        }
      });
    }
  }, [queryResult.data]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { refetch: refetchUsers } = useList({
    resource: `organizations/${id}/members`,
  });

  const handleSuccess = () => {
    setIsModalVisible(false);
    refetchUsers();
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <Button
        icon={<ArrowLeftOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
        onClick={() => navigate("/tour-partners")}
        style={{ marginBottom: 16 }}
      >
        Back to Tour Partners
      </Button>
      <CompanyTitleForm id={id ? id : ''} organization={organization} />
      <Row
        gutter={[32, 32]}
        style={{
          marginTop: 32,
        }}
      >
        <Col span={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2>Agents</h2>
            <Button
              type="primary"
              icon={<UserAddOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={showModal}
            >
              Add New Agent
            </Button>
          </div>
          <UserTable organization={organization} />
        </Col>
        <Col span={8}>
          <CompanyInfoForm organization={organization} />
        </Col>
      </Row>
      <CreateAgentModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        orgId={id || ''}
      />
    </div>
  );
};

export default CompanyEdit;
