import React from 'react'
import Accordion from 'react-bootstrap/Accordion';

const Header = () => {
  return (
    <header className="App-header" style={{marginTop:'2rem'}}>
      <p className="header-title">SeQR</p>

      <style type="text/css">
        {`
        .accordian-header > .accordion-button {
          justify-content: center;
        }
        .accordian-header > .accordion-button::after {
          justify-content: center;
          margin-left: 4px !important;
        }
      .accordion-button::after {
        flex-shrink: 0;
        width: auto
        height: var(--bs-accordion-btn-icon-width);
        content: "Learn more";
        background-image: none;
        background-repeat: no-repeat;
        background-size: var(--bs-accordion-btn-icon-width);
        transition: var(--bs-accordion-btn-icon-transition);
      }
      .accordion-button:not(.collapsed)::after {
        content: "Hide details";
        background-image: none;
        transform: none;
      }
      .accordion-button:not(.collapsed) {
        box-shadow: none !important;
      }
      .accordion-button:hover{
        --bs-accordion-btn-color: #0c63e4;
      }
      .accordion-item {
        border:none;
      }
      .accordion {
          width: 50%;
          font-size: 1rem;
        --bs-accordion-color: inherit;
        --bs-accordion-bg: inherit;
        --bs-accordion-btn-color: inherit;
        --bs-accordion-btn-active-icon: none;
        --bs-accordion-btn-focus-border-color: #86b7fe;
        --bs-accordion-btn-focus-box-shadow: none;
        --bs-accordion-active-color: #0c63e4;
        --bs-accordion-active-bg: inherit;
      }

    `}
      </style>
      <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header className='accordian-header'>Protect yourself from malicious QR Codes.</Accordion.Header>
          <Accordion.Body>
            QR codes, while convenient, can easily be used by criminals to direct unsuspecting users to malicious websites
            to conduct phishing scams, spread malware, or redirect payments. 
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </header>
  )
}

export default Header