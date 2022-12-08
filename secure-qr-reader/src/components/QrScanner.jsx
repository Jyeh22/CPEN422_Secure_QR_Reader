import React, { Component } from 'react'
//import QrReader from 'react-qr-scanner'
import Spinner from 'react-bootstrap/Spinner';
import { QrReader } from 'react-qr-reader';

export default class QrScanner extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 300,
      result: 'No result',
      validatingUrl: false,
      image:null,
    }

    this.handleScan = this.handleScan.bind(this)
  }

  handleScan = (data) => {
    if (data != null) {
      console.log(data);
      this.setState({
        validatingUrl: true,
        result: data,
      })
      this.props.setUrl(data.text);
      this.props.setDecodedQr(true);
      this.props.setStartScan(false);
    }
  }

  handleError(err){
    console.error(err)
  }
  render(){
      const previewStyle = {
        width: '30rem',
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
      { !this.state.validatingUrl && <div className="video-mask">
          <QrReader
            scanDelay={this.state.delay}
            style={previewStyle}
            onError={this.handleError}
            onResult={this.handleScan}
          />
        </div>
      }
      { this.state.validatingUrl &&
        <div style = {loadingStyle}>
          <>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          </>
        </div>
      }
      </>
    )
  }
}
