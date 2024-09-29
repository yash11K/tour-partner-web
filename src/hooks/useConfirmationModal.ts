import { Modal } from 'antd';
import styles from './useConfirmationModal.module.css';

interface ConfirmationModalProps {
  title: string;
  content: string;
  onOk: () => void | Promise<void>;
  onCancel?: () => void;
}

export const useConfirmationModal = () => {
  const showConfirmationModal = ({
    title,
    content,
    onOk,
    onCancel
  }: ConfirmationModalProps) => {
    Modal.confirm({
      title,
      content,
      onOk,
      onCancel,
      okText: 'Confirm',
      cancelText: 'Cancel',
      className: styles.customModal,
    });
  };

  return { showConfirmationModal };
};