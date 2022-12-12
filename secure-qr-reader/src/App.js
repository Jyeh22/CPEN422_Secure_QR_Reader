import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import {Header, QrScanner, HandleURL} from './components'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import './App.css';

const App = () => {

  const [startScan, setStartScan] =  useState(false);
  const [decodedQr, setDecodedQr] =  useState(false);
  const [securityMetrics, setSecurityMetrics] = useState(null);

  const startButtonStyle = {
    width: '30rem',
    marginTop: startScan ? '' : '5rem'
  }

  return (
    <Container>
      <Row>
        <Header/>
      </Row>
      <Row style={{justifyContent: 'center'}}>
        {(startScan) && 
          <QrScanner 
            setDecodedQr={setDecodedQr} 
            setStartScan={setStartScan} 
            setSecurityMetrics={setSecurityMetrics}
          />}
        {!decodedQr && <Row style={{justifyContent: 'center'}}> 
            <Button variant="primary" style={startButtonStyle} onClick={ () => setStartScan(!startScan)}>
                {startScan ? "Cancel Scan" : "Scan QR Code"}
            </Button>
          </Row>
        }
        {decodedQr && <HandleURL securityMetrics={securityMetrics} setDecodedQr={setDecodedQr}/>}
      </Row>
    </Container>
  );
}


export default App
