import './App.css';
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import {Header, QrScanner} from './components'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const App = () => {

  const [startScan, setStartScan] =  useState(false)

  const startButtonStyle = {
    width: '50%',
    marginTop: startScan ? '' : '15rem'
  }

  return (
    <Container>
      <Row style={{marginTop: '3rem'}}>
        <Header/>
      </Row>
      <Row style={{justifyContent: 'center'}}>
        {startScan && <QrScanner/>}
        <Row style={{justifyContent: 'center'}}> 
          <Button variant="outline-primary" style={startButtonStyle} onClick={ () => setStartScan(!startScan) }>
              {startScan ? "Cancel Scan" : "Scan QR Code"}
          </Button>
        </Row>
      </Row>
    </Container>
  );
}


export default App
