import React, { useState } from 'react';
import { Button } from 'antd';
import CreateAgentModal from './create';
import { useParams } from 'react-router-dom';

const UsersList: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { orgId } = useParams<{ orgId: string }>();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
    // Refresh the users list or perform any other necessary actions
  };

  return (
    <div>
      <Button onClick={showModal}>Create New Agent</Button>
      <CreateAgentModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        orgId={orgId || ''}
      />
    </div>
  );
};

export default UsersList;