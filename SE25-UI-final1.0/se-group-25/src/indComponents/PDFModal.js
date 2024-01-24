import React, { useContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import ThemeContext from '../context/ThemeContext'

const PDFModal = ({pdfURL,showLink,setShowLink}) => {
  const {theme} = useContext(ThemeContext)
  return (
    <div>
        <Modal className="modal-pdf-viewer" show={showLink} onHide={() => setShowLink(false)} id={`modal-${theme}`} size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
          <Modal.Header closeButton >
              <Modal.Title>PDF Viewer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <object className="pdf-viewer" data={pdfURL} width="100%" height="100%"/>
          </Modal.Body>
      </Modal>
    </div>
  )
}

export default PDFModal