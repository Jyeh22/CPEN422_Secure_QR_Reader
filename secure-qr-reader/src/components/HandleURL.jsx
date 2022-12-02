import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import api from '../api';


const HandleURL = ({url, setDecodedQr}) => {
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);


  const getImage = async () => {
    setShow(true);
    let res = await api.getContent(
      {
        url: url
      }
    );
    console.log(res);
    console.log('loading image');
    var blob = res.data
    blob = blob.slice(0, blob.size, "image/png");
    console.log(blob);
    setImage(URL.createObjectURL(blob));
  }
  const handleClose = () => setShow(false);

  const handleCancel = () => {
    setImage(null);
    setDecodedQr(false);
  }

  const loadingStyle = {
    width: '50%',
    marginBottom: '3rem',
    marginTop: '3rem',
    display: 'flex',
    justifyContent: 'center'
  }

  return (
    <Alert key={'warning'} variant={'warning'} style={{width:'50%', border:'none', marginTop:'3rem'}}>
      <Row>
        <Accordion style={{width: '100%'}}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Bad things happened yaddie yaddie ya</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      <hr />
      <Row style={{display: 'flex', justifyContent:'space-between', flexWrap:'nowrap'}}>
        <Button variant="outline-dark" style={{width:'9rem', marginLeft:'12px'}} onClick={handleCancel}>
          Cancel
        </Button>
        <div style={{width:'auto'}}>
          <Button variant="outline-danger" href={url} style={{width:'9rem', marginRight:'1rem'}}>
            Visit Website
          </Button>
          <Button variant="warning" style={{width:'9rem'}} onClick={getImage}>
            View Webpage
          </Button>
        </div>
      </Row>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-60w">
        <Modal.Header closeButton>
          <Modal.Title>Static Image of Webpage</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflow:'scroll', display:'flex', justifyContent:'center'}}>
          { (image == null) &&         
            <div style = {loadingStyle}>
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          }
          { (image != null) &&         
            <img src={image} alt='failed to load'></img>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" href={url}>
            Visit Website
          </Button>
        </Modal.Footer>
      </Modal>
    </Alert> 
  )
}

export default HandleURL