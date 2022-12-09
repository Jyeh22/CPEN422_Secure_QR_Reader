import React from 'react'
import Accordion from 'react-bootstrap/Accordion';

const Header = () => {
  return (
    <header className="App-header">
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
    </header>
  )
}

export default Header