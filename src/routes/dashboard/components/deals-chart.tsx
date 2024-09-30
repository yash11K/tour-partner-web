import React, { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { useNavigation, useList } from "@refinedev/core";
import { DollarOutlined, RightCircleOutlined } from "@ant-design/icons";
import type { AreaConfig } from "@ant-design/plots";
import { Button, Card, Select, Spin, Typography, DatePicker } from "antd";
import dayjs from "dayjs";
import { Text } from "@/components";
import staticReservations from "../staticReservations.json";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const Area = lazy(() => import("@ant-design/plots/es/components/area"));

interface Reservation {
  createdOn: number;
  reservationId: string;
  reservationDate: number;
  createdBy: string;
  registeredPartner: string;
  amount: number;
  currency: string;
  typeOf: "create" | "cancel";
}

export const DashboardDealsChart: React.FC = () => {
	const { list } = useNavigation();
	const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
	const [timeFrame, setTimeFrame] = useState<"daily" | "monthly">("monthly");
	const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

	// Use static data from JSON file
	const data: Reservation[] = staticReservations as Reservation[];

	// Function to get the last 30 days of data
	// const getLast30DaysData = (data: Reservation[]) => {
	// 	const thirtyDaysAgo = dayjs().subtract(30, 'day').startOf('day');
	// 	return data.filter(reservation => dayjs(reservation.reservationDate).isAfter(thirtyDaysAgo));
	// };

	// Effect to update dateRange when timeFrame changes
	useEffect(() => {
		if (timeFrame === "daily") {
			setDateRange(null);
		} else {
			setDateRange(null);
		}
	}, [timeFrame]);

	const chartData = useMemo(() => {
		let filteredData = selectedPartnerId
			? data.filter((reservation) => reservation.registeredPartner === selectedPartnerId)
			: data;

		// Apply date range filter
		if (dateRange) {
			const [startDate, endDate] = dateRange;
			filteredData = filteredData.filter((reservation) => {
				const reservationDate = dayjs(reservation.reservationDate);
				return reservationDate.isAfter(startDate) && reservationDate.isBefore(endDate.endOf('day'));
			});
		}

		// Limit to last 30 days if in daily mode
		// if (timeFrame === "daily") {
		// 	filteredData = getLast30DaysData(filteredData);
		// }

		const groupedData = filteredData.reduce((acc, reservation) => {
			const date = dayjs(reservation.reservationDate);
			const key = timeFrame === "daily" ? date.format("YYYY-MM-DD") : date.format("MMM YYYY");
			const state = reservation.typeOf === "create" ? "booked" : "cancelled";
			
			if (!acc[key]) {
				acc[key] = { booked: 0, cancelled: 0 };
			}
			
			acc[key][state] += reservation.amount;
			return acc;
		}, {} as Record<string, { booked: number; cancelled: number }>);

		return Object.entries(groupedData).flatMap(([date, values]) => [
			{ timeText: date, value: values.booked, state: "booked" },
			{ timeText: date, value: values.cancelled, state: "cancelled" },
		]).sort((a, b) => dayjs(a.timeText).unix() - dayjs(b.timeText).unix());
	}, [data, selectedPartnerId, timeFrame, dateRange]);

	const totalRevenue = useMemo(() => {
		const bookedAmount = chartData
			.filter(item => item.state === "booked")
			.reduce((sum, item) => sum + item.value, 0);
		const cancelledAmount = chartData
			.filter(item => item.state === "cancelled")
			.reduce((sum, item) => sum + item.value, 0);
		return bookedAmount - cancelledAmount;
	}, [chartData]);

	const partnerOptions = useMemo(() => {
		const uniquePartners = [...new Set(data.map(item => item.registeredPartner))];
		return uniquePartners.map(partnerId => ({ value: partnerId, label: partnerId }));
	}, [data]);

	const config: AreaConfig = {
		isStack: false,
		data: chartData,
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
			const won = "l(270) 0:#ffffff 0:#b7eb8f 1:#52c41a";
			const lost = "l(270) 0:#ffffff 0.5:#f3b7c2 1:#ff4d4f";
			return { fill: datum.state === "booked" ? won : lost };
		},
		color: (datum) => {
			return datum.state === "booked" ? "#52C41A" : "#F5222D";
		},
		xAxis: {
			label: {
				formatter: (v) => {
					return timeFrame === "daily" ? dayjs(v).format("MMM DD") : v;
				},
			},
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
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Select
						style={{ width: 200 }}
						placeholder="Filter by Partner"
						onChange={(value) => setSelectedPartnerId(value)}
						allowClear
						options={partnerOptions}
					/>
					<Select
						style={{ width: 120 }}
						value={timeFrame}
						onChange={(value) => setTimeFrame(value)}
						options={[
							{ value: "daily", label: "Daily" },
							{ value: "monthly", label: "Monthly" },
						]}
					/>
					<RangePicker
						onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
						style={{ width: 250 }}
						disabled={timeFrame === "daily"}
						value={dateRange}
					/>
					<Button onClick={() => list("deals")} icon={<RightCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
						See Reservation Details
					</Button>
				</div>
			}
		>
			<Title level={4} style={{ marginBottom: '20px', textAlign: 'center' }}>
				Total Revenue: ${(totalRevenue / 1000).toFixed(2)}k
			</Title>
			<Suspense fallback={<Spin size="large" />}>
				<Area {...config} height={325} />
			</Suspense>
		</Card>
	);
};