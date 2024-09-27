import React from "react";
import { useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CompanyInfoForm } from "./components/info-form";
import { UserTable } from "./components/user-table";
import { Organization } from "@/rest-api/types";
import { CompanyTitleForm } from "./components";

export const CompanyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { queryResult } = useShow<Organization>({
    resource: "organizations",
    id: id,
  });
  const navigate = useNavigate();
  const organization = queryResult.data?.data;

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <Button
        icon={<ArrowLeftOutlined onPointerEnterCapture={onpointerenter} onPointerLeaveCapture={onpointerleave} />}
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
          <UserTable organization={organization} />
        </Col>
        <Col span={8}>
          <CompanyInfoForm organization={organization} />
        </Col>
      </Row>
    </div>
  );
};

export default CompanyEdit;
