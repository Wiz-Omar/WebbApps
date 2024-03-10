import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/squid.png';
import './Navbar.css';
import IconButton from '../../common/IconButton/IconButton';
import { Image } from '../../../components/home_page/HomePage';
import DeleteIcon from './DeleteIcon';
import DownloadIcon from './DownloadIcon';
import CloseIcon from './CloseIcon';
import axios from 'axios';
import ConfirmationPopup from '../ConfirmationPopup';
import { handleDownload } from '../../../utils/handleDownload';
import { handleChangeName } from '../../../utils/handleChangeName';
import { Container, Row, Col } from 'react-bootstrap';
import FilenameInput from './FilenameInput';
import IconButtonsGroup from './IconButtonsGroup';
import useDeleteImage from '../../../hooks/useDeleteImage';


axios.defaults.withCredentials = true;

function Navbar() {
  const location = useLocation();
  const { image } = location.state as { image: Image };
  const navigate = useNavigate();

  const filenameParts = image.filename.split('.');
  const initialFilename = filenameParts.slice(0, -1).join('.'); // Join all parts except the last one
  const fileExtension = filenameParts.pop() as string;

  let [newFilename, setNewFilename] = useState(initialFilename);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const { deleteImage } = useDeleteImage();

  const handleDownloadClick = async () => {
    await handleDownload(image);
  };

  const handleDeleteClick = () => setShowDeletePopup(true);

  const handleConfirmDelete = async () => {
    await deleteImage(image.id.toString());
    setShowDeletePopup(false);
    navigate('/');
  };

  const handleCancelDelete = () => setShowDeletePopup(false);

  const handleClose = () => navigate('/');

  const handleRename = async (filename: string, fileExtension: string) => {
    await handleChangeName(image.id, filename, fileExtension);
    setNewFilename(filename);
  };

  return (
    <Container fluid className="navbar-light sticky-top rounded bg-light">
      <Row className="mx-5">
        <Col md={2} className="d-flex justify-content-center mb-2 align-items-center">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" className="logo-img mr-2" />
            <span className="logo-text">PicPics</span>
          </a>
        </Col>
        <Col md={8} className="d-flex justify-content-center my-3 align-items-center">
          <FilenameInput
            initialFilename={initialFilename}
            fileExtension={fileExtension}
            onRename={handleRename}
          />
        </Col>
        <Col md={2} className="d-flex justify-content-center mb-2 align-items-center">
          <IconButtonsGroup
            onDownload={handleDownloadClick}
            onDelete={handleDeleteClick}
            onClose={handleClose}
          />
        </Col>
      </Row>
      <ConfirmationPopup
        isOpen={showDeletePopup}
        message="Are you sure you want to delete this image?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Container>
  );
}

export default Navbar;
