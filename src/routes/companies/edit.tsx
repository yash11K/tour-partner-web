import { Col, Row } from "antd";

import {
  CompanyInfoForm,
  CompanyQuotesTable,
  CompanyTitleForm,

} from "./components";
export const CompanyEditPage = () => {
  return (
    <div className="page-container">
      <CompanyTitleForm />
      <Row
        gutter={[32, 32]}
        style={{
          marginTop: 32,
        }}
      >
        <Col span={8}>
          <CompanyInfoForm />
        </Col>
      </Row>
    </div>
  );
};
