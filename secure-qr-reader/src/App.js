import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import {Header, QrScanner, HandleURL} from './components'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './App.css';

const App = () => {

  const [startScan, setStartScan] =  useState(false);
  const [decodedQr, setDecodedQr] =  useState(false);
  const [urlMetrics, setUrlMetrics] = useState(false);
  const [url, setUrl] = useState(null);

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
        {(startScan) && 
          <QrScanner 
            setUrl={setUrl} 
            setDecodedQr={setDecodedQr} 
            setStartScan={setStartScan} 
            setUrlMetrics={setUrlMetrics}
          />}
        {!decodedQr && <Row style={{justifyContent: 'center'}}> 
            <Button variant="outline-primary" style={startButtonStyle} onClick={ () => setStartScan(!startScan) }>
                {startScan ? "Cancel Scan" : "Scan QR Code"}
            </Button>
          </Row>
        }
        {decodedQr && <HandleURL url={url} setDecodedQr={setDecodedQr}/>}
      </Row>
    </Container>
  );
}


export default App
