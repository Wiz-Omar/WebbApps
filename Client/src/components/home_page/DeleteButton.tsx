import React from "react";
import DeleteIcon from "./DeleteIcon";
import "./Button.css";

interface DeleteButtonProps {
  callback: () => void;
}

const DeleteButton = ({ callback }: DeleteButtonProps) => {
  return (
    <div className="button" onClick={ callback }>
        <DeleteIcon />
    </div>
  );
};

export default DeleteButton;
