import React, { useState, useMemo } from "react";
import { Table, Input, DatePicker, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Reservation } from "@/rest-api/types";
import type { ColumnType } from "antd/es/table";
import dayjs from 'dayjs';
import { Key } from 'antd/es/table/interface';

interface ReservationsTableProps {
  reservations: Reservation[];
  isLoading: boolean;
}

export const ReservationsTable: React.FC<ReservationsTableProps> = ({ reservations, isLoading }) => {
  const [searchText, setSearchText] = useState("");
  const [dateFilters, setDateFilters] = useState<Record<string, [number, number] | null>>({
    createdOn: null,
    reservationDate: null,
  });
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const columns: ColumnType<Reservation>[] = [
    {
      title: 'Reservation ID',
      dataIndex: 'reservationId',
      key: 'reservationId',
      sorter: (a: Reservation, b: Reservation) => a.reservationId.localeCompare(b.reservationId),
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (createdOn: number) => dayjs(createdOn).format('YYYY-MM-DD'),
      sorter: (a: Reservation, b: Reservation) => a.createdOn - b.createdOn,
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
        <DatePicker.RangePicker
          onChange={(dates) => {
            const values = dates 
              ? [dates[0]?.valueOf() ?? 0, dates[1]?.valueOf() ?? 0] as [number, number]
              : null;
            setDateFilters(prev => ({ ...prev, createdOn: values }));
            setSelectedKeys(values ? values : []);
            confirm();
          }}
          style={{ margin: 8 }}
        />
      ),
      onFilter: (value: any, record: Reservation) => {
        if (Array.isArray(value) && value.length === 2) {
          const [start, end] = value as [number, number];
          return record.createdOn >= start && record.createdOn <= end;
        }
        return true;
      },
    },
    {
      title: 'Reservation Date',
      dataIndex: 'reservationDate',
      key: 'reservationDate',
      render: (reservationDate: number) => dayjs(reservationDate).format('YYYY-MM-DD'),
      sorter: (a: Reservation, b: Reservation) => a.reservationDate - b.reservationDate,
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
        <DatePicker.RangePicker
          onChange={(dates) => {
            const values = dates 
              ? [dates[0]?.valueOf() ?? 0, dates[1]?.valueOf() ?? 0] as [number, number]
              : null;
            setDateFilters(prev => ({ ...prev, reservationDate: values }));
            setSelectedKeys(values ? values : []);
            confirm();
          }}
          style={{ margin: 8 }}
        />
      ),
      onFilter: (value: any, record: Reservation) => {
        if (Array.isArray(value) && value.length === 2) {
          const [start, end] = value as [number, number];
          return record.reservationDate >= start && record.reservationDate <= end;
        }
        return true;
      },
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      sorter: (a: Reservation, b: Reservation) => a.createdBy.localeCompare(b.createdBy),
    },
    {
      title: 'Registered Partner',
      dataIndex: 'registeredPartner',
      key: 'registeredPartner',
      sorter: (a: Reservation, b: Reservation) => a.registeredPartner.localeCompare(b.registeredPartner),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Reservation) => `${amount} ${record.currency}`,
      sorter: (a: Reservation, b: Reservation) => a.amount - b.amount,
    },
    {
      title: 'Type',
      dataIndex: 'typeOf',
      key: 'typeOf',
      sorter: (a: Reservation, b: Reservation) => a.typeOf.localeCompare(b.typeOf),
      filters: [
        { text: 'Create', value: 'create' },
        { text: 'Cancel', value: 'cancel' },
      ],
      filterMultiple: true,
      onFilter: (value: boolean | Key, record: Reservation) => record.typeOf === value.toString(),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Select
            mode="multiple"
            style={{ width: 188, marginBottom: 8, display: 'block' }}
            placeholder="Select type"
            value={selectedKeys as string[]}
            onChange={(values) => {
              setSelectedKeys(values);
              setTypeFilter(values);
            }}
            options={[
              { value: 'create', label: 'Create' },
              { value: 'cancel', label: 'Cancel' },
            ]}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Filter
          </Button>
          <Button
            onClick={() => {
              clearFilters?.();
              setTypeFilter([]);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
    },
  ];

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      // Apply text search filter
      const matchesSearch = Object.values(reservation).some((value) =>
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      );

      // Apply date filters
      const matchesCreatedOn = !dateFilters.createdOn || 
        (reservation.createdOn >= dateFilters.createdOn[0] && reservation.createdOn <= dateFilters.createdOn[1]);
      const matchesReservationDate = !dateFilters.reservationDate || 
        (reservation.reservationDate >= dateFilters.reservationDate[0] && reservation.reservationDate <= dateFilters.reservationDate[1]);

      // Apply type filter
      const matchesType = typeFilter.length === 0 || typeFilter.includes(reservation.typeOf);

      return matchesSearch && matchesCreatedOn && matchesReservationDate && matchesType;
    });
  }, [reservations, searchText, dateFilters, typeFilter]);

  return (
    <>
      <Input
        placeholder="Search reservations"
        prefix={<SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={filteredReservations}
        columns={columns}
        rowKey="reservationId"
        loading={isLoading}
        scroll={{ x: true }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={(pagination, filters, sorter) => {
          console.log('Table change:', pagination, filters, sorter);
        }}
      />
    </>
  );
};