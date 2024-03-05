import React, { useState } from "react";
import "./Button.css";
import ClickableIcon from "../common/ClickableIcon";
import { Check2, Trash, XLg } from "react-bootstrap-icons";

interface DeleteButtonProps {
  callback: () => void;
}

const DeleteButton = ({ callback }: DeleteButtonProps) => {
  const [confirmationNeeded, setConfirmationNeeded] = useState(false);

  const handleConfirmDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent event from bubbling
    callback();
    setConfirmationNeeded(false); // It should set to false to close the confirmation options
  };

  const handleCancelDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent event from bubbling
    setConfirmationNeeded(false);
  };

  return (
    <div className="button" onClick={() => setConfirmationNeeded(true)}>
      {!confirmationNeeded ? (
        // Use the Bootstrap Trash icon
        <Trash />
      ) : (
        <div>
          <ClickableIcon onClick={handleConfirmDelete} icon={<Check2 />} />
          <ClickableIcon onClick={handleCancelDelete} icon={<XLg />} />
        </div>
      )}
    </div>
  );
};

export default DeleteButton;
