import React, { useState, useEffect } from 'react'
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

import {FaMinus, FaTimes} from 'react-icons/fa'
import api from '../api';


const HandleURL = ({securityMetrics, setDecodedQr}) => {
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  const [viewDetails, setView] = useState(false);
  const [isDeceptive, setIsDeceptive] = useState(false);
  const [validCert, setValidSert] = useState(false);
  const [knownPhish, setKnownPhish] = useState(false);
  const [knownSite, setKnownSite] = useState(false);
  const [domainAgeValid, setDomainAgeValid ] = useState(false);

  useEffect(() => {
    let phishHitRate = parseInt(securityMetrics.domDetected.replace ( /[^\d.]/g, '' ), 10); //converts % to int
    setKnownPhish(phishHitRate > 0 ? true : false);
    setValidSert(securityMetrics.certFound && securityMetrics.certValid);
    
    setKnownSite(securityMetrics.googleTree > 2)

    let age = Date.now() - Date.parse(securityMetrics.date);
    let minAge = 3 * 2678400; //3 months
    setDomainAgeValid(age > minAge);

    setIsDeceptive(!validCert || knownPhish || !knownSite || !domainAgeValid);
  }, [validCert, knownPhish, knownSite, domainAgeValid, securityMetrics]);

  const getImage = async () => {
    setShow(true);
    let res = await api.getContent(
      {
        url: securityMetrics.plaintext
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
    <>
    <style type="text/css">
          {`
        .warning-details>.accordion-button::after {
          margin-left: auto !important;
          content: "View details";
        }
        .accordion-button:not(.collapsed)::after {
          content: "Hide details";
        }
        .list-group {
          --bs-list-group-color: inherit;
          --bs-list-group-bg: inherit;
        }
        .list-group .valid-list{
          color: #664d03;
          background-color: #fff3cd;
        }
        .list-group-item{
          padding: 0px;
        }
        .list-group-item > svg {
          margin-bottom: 1.75 px;
        }
        `}
        </style>
      { isDeceptive ?
        <Alert key={'warning'} variant={'danger'} style={{width:'50%', border:'none', marginTop:'3rem'}}>
        <Alert.Heading>Deceptive Site!</Alert.Heading>
        <p> <b>{securityMetrics.plaintext}</b> has been determined to be unsafe</p>
        <p>Attackers on this site may trick you into doing something dangerous like installing a program or revealing personal information</p>
        <hr/>
        <Row>
          <Accordion style={{width: '100%'}}>
            <Accordion.Item eventKey="0">
              <Accordion.Header className='warning-details' onClick={() => setView(!viewDetails)}> </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className={!knownPhish && 'valid-list'}>
                      <Accordion style={{width: '100%'}}>
                        <Accordion.Header style={{width:'100%'}}>
                          {!knownPhish ? <FaMinus/> : <FaTimes/>}
                          {!knownPhish ? <b>Not a known phishing site</b> : <b>Known phishing site</b>}
                        </Accordion.Header>
                        <Accordion.Body>
                          {knownPhish ? 
                            'This website has appeared in several databases of known phishing websites' :
                            'This website does not appear in any of the databses of known phishing websites we checked'}
                        </Accordion.Body>
                      </Accordion>
                    </ListGroup.Item>
                    <ListGroup.Item className={validCert && 'valid-list'}>
                      <Accordion style = {{width:'100%'}}>
                        <Accordion.Header style={{width:'100%'}}>
                          {validCert ? <FaMinus/> : <FaTimes/>} 
                          {validCert ?<b>Valid certificate</b> : <b>Invalid certificate</b> }
                        </Accordion.Header>
                        <Accordion.Body>
                        {validCert ? 'This website posses a valid SSL certificate issued by a trusted authority' : 
                        'This website does not possess a valid SSL certificate issued by a trusted authority. '}
                        </Accordion.Body>
                      </Accordion>
                    </ListGroup.Item>
                    <ListGroup.Item className={knownSite && 'valid-list'}>
                      <Accordion style = {{width:'100%'}}>
                          <Accordion.Header style={{width:'100%'}}>
                            {knownSite ? <FaMinus/> : <FaTimes/>}
                            {knownSite ? <b>Known website</b> : <b>Unknown Website</b>}
                        </Accordion.Header>
                        <Accordion.Body>
                          This website name has a {knownSite ? 'reasonably high':'low'} score in the <a href="https://blog.google/products/search/introducing-knowledge-graph-things-not/">google knowledge graph</a>.
                          The graph is a measure of how many times an entity is mentioned in search results.
                        </Accordion.Body>
                      </Accordion>
                    </ListGroup.Item>
                    <ListGroup.Item className={domainAgeValid && 'valid-list'}>
                      <Accordion style = {{width:'100%'}}>
                        <Accordion.Header style={{width:'100%'}}>
                          {domainAgeValid ? <FaMinus/> : <FaTimes/>}
                          <b>Domain Age: </b> 
                        </Accordion.Header>
                        <Accordion.Body>
                          This website was created on {securityMetrics.date}. Websites created more recently tend to be less trustworthy.
                        </Accordion.Body>
                      </Accordion>
                    </ListGroup.Item>
                  </ListGroup>
                <Row style={{display: 'flex', felxWrap:'wrap', justifyContent:'space-between', flexWrap:'warp', marginTop:'20px'}}>
                  <Button variant="outline-dark" style={{width:'9rem', marginLeft:'12px'}} onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div style={{width:'auto', padding:'0px', flexWrap:'wrap'}}>
                    <Button variant="outline-danger" href={securityMetrics.plaintext} style={{width:'9rem', marginRight:'1rem'}}>
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
            <Modal.Title>Snapshot of Webpage</Modal.Title>
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
            <Button variant="danger" href={securityMetrics.plaintext}>
              Visit Website
            </Button>
          </Modal.Footer>
        </Modal>
      </Alert> :
      <Alert key={'warning'} variant={'warning'} style={{width:'50%', border:'none', marginTop:'3rem'}}>
        <Alert.Heading> Nothing suspicous detected!</Alert.Heading>
        <p> <b>{securityMetrics.plaintext}</b> has not been flagged</p>
        <Row style={{display: 'flex', felxWrap:'wrap', justifyContent:'space-between', flexWrap:'warp', marginTop:'20px'}}>
                <Button variant="outline-dark" style={{width:'9rem', marginLeft:'12px'}} onClick={handleCancel}>
                  Cancel
                </Button>
                <div style={{width:'auto', padding:'0px', marginRight: '12px', flexWrap:'wrap'}}>
                  <Button variant="outline-dark" href={securityMetrics.plaintext} style={{width:'9rem', marginRight:'1rem'}}>
                    Visit Website
                  </Button>
                  <Button variant="warning" style={{width:'9rem'}} onClick={getImage}>
                    View Snapshot
                </Button>
              </div>
          </Row>
      </Alert>
  }
    </> 
  )
}

export default HandleURL
