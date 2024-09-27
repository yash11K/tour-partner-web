import React, { Suspense, useMemo } from "react";
import { DollarOutlined } from "@ant-design/icons";
import type { GaugeConfig } from "@ant-design/plots";
import { Card, Space } from "antd";
import { Text } from "@/components";
import { currencyNumber } from "@/utilities";

const Gauge = React.lazy(() => import("@ant-design/plots/es/components/gauge"));

export const DashboardTotalRevenueChart: React.FC = () => {
  // Default data
  const defaultData = useMemo(() => {
    const totalExpectedRevenue = 1000000; // $1,000,000
    const totalRealizationRevenue = 750000; // $750,000
    const realizationPercentageOfExpected = (totalRealizationRevenue / totalExpectedRevenue) * 100;
    return { totalExpectedRevenue, totalRealizationRevenue, realizationPercentageOfExpected };
  }, []);

  const config: GaugeConfig = {
    animation: true,
    supportCSSTransform: true,
    percent: defaultData.realizationPercentageOfExpected / 100,
    range: {
      color: "l(0) 0:#D9F7BE 1:#52C41A",
    },
    axis: {
      tickLine: {
        style: {
          stroke: "#BFBFBF",
        },
      },
      label: {
        formatter(v) {
          return Number(v) * 100;
        },
      },
      subTickLine: {
        count: 3,
      },
    },
    indicator: {
      pointer: {
        style: {
          fontSize: 4,
          stroke: "#BFBFBF",
          lineWidth: 2,
        },
      },
      pin: {
        style: {
          r: 8,
          lineWidth: 2,
          stroke: "#BFBFBF",
        },
      },
    },
    statistic: {
      content: {
        formatter: (datum) => {
          return `${(datum?.percent * 100).toFixed(2)}%`;
        },
        style: {
          color: "rgba(0,0,0,0.85)",
          fontWeight: 500,
          fontSize: "24px",
        },
      },
    },
  };

  return (
    <Card
      style={{ height: "100%" }}
      bodyStyle={{
        padding: "0 32px 32px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      headStyle={{ padding: "16px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <DollarOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <Text size="sm">Total revenue (yearly)</Text>
        </div>
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Gauge {...config} padding={0} width={280} height={280} />
      </Suspense>

      <div
        style={{
          display: "flex",
          gap: "32px",
        }}
      >
        <Space direction="vertical" size={0}>
          <Text size="xs" className="secondary">
            Expected
          </Text>
          <Text
            size="md"
            className="primary"
            style={{
              minWidth: "100px",
            }}
          >
            {currencyNumber(defaultData.totalExpectedRevenue)}
          </Text>
        </Space>
        <Space direction="vertical" size={0}>
          <Text size="xs" className="secondary">
            Realized
          </Text>
          <Text
            size="md"
            className="primary"
            style={{
              minWidth: "100px",
            }}
          >
            {currencyNumber(defaultData.totalRealizationRevenue)}
          </Text>
        </Space>
      </div>
    </Card>
  );
};
