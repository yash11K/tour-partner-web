import React, { lazy, Suspense, useMemo } from "react";
import { useNavigation } from "@refinedev/core";
import { DollarOutlined, RightCircleOutlined } from "@ant-design/icons";
import type { AreaConfig } from "@ant-design/plots";
import { Button, Card } from "antd";
import dayjs from "dayjs";
import { Text } from "@/components";

const Area = lazy(() => import("@ant-design/plots/es/components/area"));

export const DashboardDealsChart: React.FC = () => {
	const { list } = useNavigation();

	// Default data
	const defaultData = useMemo(() => {
		const generateData = (state: "Won" | "Lost") => {
			const startDate = dayjs().subtract(6, 'month');
			return Array.from({ length: 6 }, (_, i) => {
				const date = startDate.add(i, 'month');
				return {
					timeUnix: date.unix(),
					timeText: date.format("MMM YYYY"),
					value: Math.floor(Math.random() * 100000) + 50000, // Random value between 50k and 150k
					state,
				};
			});
		};

		return [...generateData("Won"), ...generateData("Lost")].sort(
			(a, b) => a.timeUnix - b.timeUnix
		);
	}, []);

	const config: AreaConfig = {
		isStack: false,
		data: defaultData,
		xField: "timeText",
		yField: "value",
		seriesField: "state",
		animation: true,
		startOnZero: false,
		smooth: true,
		legend: {
			offsetY: -6,
		},
		yAxis: {
			tickCount: 4,
			label: {
				formatter: (v) => {
					return `$${Number(v) / 1000}k`;
				},
			},
		},
		tooltip: {
			formatter: (data) => {
				return {
					name: data.state,
					value: `$${Number(data.value) / 1000}k`,
				};
			},
		},
		areaStyle: (datum) => {
			const won = "l(270) 0:#ffffff 0.5:#b7eb8f 1:#52c41a";
			const lost = "l(270) 0:#ffffff 0.5:#f3b7c2 1:#ff4d4f";
			return { fill: datum.state === "Won" ? won : lost };
		},
		color: (datum) => {
			return datum.state === "Won" ? "#52C41A" : "#F5222D";
		},
	};

	return (
		<Card
			style={{ height: "100%" }}
			headStyle={{ padding: "8px 16px" }}
			bodyStyle={{ padding: "24px 24px 0px 24px" }}
			title={
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
					}}
				>
					<DollarOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
					<Text size="sm" style={{ marginLeft: ".5rem" }}>
						Deals
					</Text>
				</div>
			}
			extra={
				<Button onClick={() => list("deals")} icon={<RightCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
          See Reservation Details
				</Button>
			}
		>
			<Suspense fallback={<div>Loading...</div>}>
				<Area {...config} height={325} />
			</Suspense>
		</Card>
	);
};
