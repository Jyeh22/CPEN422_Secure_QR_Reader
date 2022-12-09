import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'
import Spinner from 'react-bootstrap/Spinner';
import api from '../api';

export default class QrScanner extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
      validatingUrl: false,
      image:null,
    }

    this.handleScan = this.handleScan.bind(this)
  }

  handleScan = async (data) => {
    if (data != null) {
      console.log(data);
      this.setState({
        validatingUrl: true,
        result: data,
      })
      let res = await api.getMetrics(
        {
          data: data.text
        }
      );
      this.props.setSecurityMetrics(res.data);
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
            delay={this.state.delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
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
