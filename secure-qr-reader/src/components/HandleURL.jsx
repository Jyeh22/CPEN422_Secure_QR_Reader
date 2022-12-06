import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import api from '../api';


const HandleURL = ({url, setDecodedQr}) => {
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  const [viewDetails, setView] = useState(false);


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
    <Alert key={'warning'} variant={'danger'} style={{width:'50%', border:'none', marginTop:'3rem'}}>
      <Alert.Heading>Deceptive Site!</Alert.Heading>
      <p> <b>{url}</b> has been determined to be unsafe</p>
      <p>Attackers on this site may trick you into doing something dangerous like installing a program or revealing personal information</p>
      <hr/>
      <style type="text/css">
        {`
      .warning-details>.accordion-button::after {
        margin-left: auto !important;
        content: "View details";
      }
      `}
      </style>
      <Row>
        <Accordion style={{width: '100%'}}>
          <Accordion.Item eventKey="0">
            <Accordion.Header className='warning-details' onClick={() => setView(!viewDetails)}> </Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>Cras justo odio</ListGroup.Item>
                  <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                  <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                  <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                  <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
              <Row style={{display: 'flex', felxWrap:'wrap', justifyContent:'space-between', flexWrap:'warp', marginTop:'20px'}}>
                <Button variant="outline-dark" style={{width:'9rem', marginLeft:'12px'}} onClick={handleCancel}>
                  Cancel
                </Button>
                <div style={{width:'auto', padding:'0px', flexWrap:'wrap'}}>
                  <Button variant="outline-danger" href={url} style={{width:'9rem', marginRight:'1rem'}}>
                    Visit Website
                  </Button>
                  <Button variant="warning" style={{width:'9rem'}} onClick={getImage}>
                    View Snapshot
                  </Button>
                </div>
            </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      { !viewDetails && <Row style={{display: 'flex', justifyContent:'space-between', flexWrap:'nowrap'}}>
        <Button variant="outline-dark" style={{width:'9rem', marginLeft:'32px'}} onClick={handleCancel}>
          Cancel
        </Button>
      </Row>}
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