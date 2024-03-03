import React, { useState } from "react";
import DeleteIcon from "./DeleteIcon";
import "./Button.css";
import CheckIcon from "../common/CheckIcon";
import IconButton from "../common/IconButton";
import CrossIcon from "../common/CrossIcon";
import Icon from "../common/Icon";

interface DeleteButtonProps {
  callback: () => void;
}

const DeleteButton = ({ callback }: DeleteButtonProps) => {
  const [confirmationNeeded, setConfirmationNeeded] = useState(false);

  /* const handleDeleteClick = () => {
    setConfirmationNeeded(true);
  }; */

  const handleConfirmDelete = () => {
    callback();
    setConfirmationNeeded(false); // Reset state (optional, depending on desired UX)
  };

  const handleCancelDelete = () => {
    setConfirmationNeeded(false);
  };

  return (
    <div className="button">
      {!confirmationNeeded ? (
        <Icon onClick={() => setConfirmationNeeded(true)} Icon={DeleteIcon} />
      ) : (
        <div>
          <Icon onClick={handleConfirmDelete} Icon={CheckIcon} />
          <Icon onClick={handleCancelDelete} Icon={CrossIcon} />
        </div>
      )}
    </div>
  );
};

export default DeleteButton;
