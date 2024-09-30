import React from "react";
import { useList } from "@refinedev/core";
import { Col, Row } from "antd";

import {
  DashboardDealsChart,
  DashboardTotalCountCard,
  DashboardTotalRevenueChart,
  ReservationsTable,
} from "./components";
import { Reservation } from "@/rest-api/types";
import staticReservations from "./staticReservations.json";

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useList<Reservation>({
    resource: "reservations",
    // Use static data instead of fetching from API
    queryOptions: {
      enabled: false,
      initialData: {
        data: staticReservations as Reservation[],
        total: staticReservations.length,
      },
    },
  });

  const reservations = data?.data ?? [];

  return (
    <div className="page-container">
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="companies"
            isLoading={isLoading}
            totalCount={300}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="contacts"
            isLoading={isLoading}
            totalCount={300}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="deals"
            isLoading={isLoading}
            totalCount={300}
          />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col
          xs={24}
          sm={24}
          xl={8}
          style={{
            height: "432px",
          }}
        >
          <DashboardTotalRevenueChart />
        </Col>
        <Col
          xs={24}
          sm={24}
          xl={16}
          style={{
            height: "432px",
          }}
        >
          <DashboardDealsChart />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col span={24}>
          <ReservationsTable reservations={reservations} isLoading={isLoading} />
        </Col>
      </Row>
    </div>
  );
};
