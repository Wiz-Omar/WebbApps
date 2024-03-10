import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ConfirmationPopupProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A confirmation popup component. It is used to confirm an action before it is executed.
 */
const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <Modal show={isOpen} onHide={onCancel} centered data-testid="confirm-popup">
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          No
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationPopup;
