import React from "react";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { Row, Col } from "antd";
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
  const organization = queryResult.data?.data;

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    // <Row gutter={[16, 16]}>
    //   <Col xs={24} lg={16}>
    //     <UserTable organization={organization} />
    //   </Col>
    //   <Col xs={24} lg={8}>
    //     <CompanyInfoForm organization={organization} />
    //   </Col>
    // </Row>
    <div className="page-container">
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
