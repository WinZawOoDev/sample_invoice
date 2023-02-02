import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import LoadingSpinner from './LoadingSpinner'
import { BsPencil, BsTrash, BsEye } from 'react-icons/bs'
import InvoiceDataService from '../services/invoices.service'


function InvoiceList() {

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewInv, setViewInv] = useState({ show: false, data: {} });

  const getInvoices = async () => {
    setLoading(true);
    const data = await InvoiceDataService.getAllInvoices();
    setInvoices(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  }

  useEffect(() => {
    getInvoices();
  }, []);


  const handleInvDelete = async (id) => {
    await InvoiceDataService.deleteInvoice(id);
    getInvoices();
  }

  const handleInvView = (id) => {
    const inv = invoices.find(inv => inv.id === id);
    setViewInv(prev => ({ ...prev, show: true, data: inv }))
  }


  function dataTable() {
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Invoice Name</th>
            <th className='text-center'>Numbers of Items</th>
            <th className='text-center'>Amount</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            invoices?.map(inv => (
              <tr key={inv.id}>
                <td>
                  {inv.name}
                </td>
                <td className='text-center'>
                  {inv?.items.length}
                </td>
                <td className='text-center'>
                  {inv?.total}
                </td>
                <td>
                  <div className='d-flex justify-content-center '>
                    <Button onClick={() => handleInvView(inv.id)} size='sm' variant='info' className='mx-2'>
                      <BsEye className='text-black' />
                    </Button>
                    <Link to={`invoice-update/invid/${inv.id}`}>
                      <Button size='sm' variant='warning' className='mx-2'>
                        <BsPencil className='text-black' />
                      </Button>
                    </Link>
                    <Button onClick={() => handleInvDelete(inv.id)} size='sm' variant='danger' className='mx-2'>
                      <BsTrash className='text-white' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }


  return (
    <>
      <Card className='mt-5'>
        <Card.Header>
          <Row>
            <Col>
              <Card.Title>
                <span className='h3'>Invoice list</span>
              </Card.Title>
            </Col>
            <Col className='justify-content-end'>
              <div className='d-flex justify-content-end align-items-baseline'>
                <Link to="invoice-create">
                  <Button variant="outline-primary">Create New Invoice</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {
            loading ? <LoadingSpinner /> :
              (
                <>
                  <ListForm />
                  {dataTable()}
                </>
              )
          }
        </Card.Body>
      </Card>
      <ViewInvoice show={viewInv.show} onHide={() => setViewInv(prev => ({ ...prev, show: false, data: {} }))} data={viewInv.data} />
    </>
  );
}




function ListForm() {
  return (
    <Row >
      <Col lg="4" md="6">
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>
              Search Invoice
            </Form.Label>
            <Form.Control type='text' placeholder="Enter invoice Number" />
          </Form.Group>
        </Form>
      </Col>
    </Row>
  )
}


function ViewInvoice({ show, onHide, data }) {

  if (!show) return;

  return (
    <Modal
      show={show}
      size="lg"
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span className='mx-2 fs-5'>{data.name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='mx-3'>
        <Table size="sm" className='table table-borderless'>
          <thead>
            <tr>
              <th className='border border-top-0 border-end-0 border-start-0'>Item Name</th>
              <th className='text-center border border-top-0 border-end-0 border-start-0'>Number of Items</th>
              <th className='text-center border border-top-0 border-end-0 border-start-0'>Price</th>
              <th className='text-center border border-top-0 border-end-0 border-start-0'>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.items?.map((itm, index) => (
                <tr key={index}>
                  <td className=''>{itm.name}</td>
                  <td className='text-center'>{itm.qty}</td>
                  <td className='text-center '>{itm.price}</td>
                  <td className='text-end pe-3'>{itm.total}</td>
                </tr>
              ))
            }

            <tr className=''>
              <th rowSpan="4" colSpan="2" className='border border-bottom-0 border-end-0 border-start-0'></th>
            </tr>
            <tr>
              <td className='border-none pt-3 border border-bottom-0 border-end-0 border-start-0 text-capitalize'>subtotal</td>
              <td className='text-end pe-3 pt-3 border border-bottom-0 border-end-0 border-start-0'>{data?.subtotal}</td>
            </tr>
            <tr>
              <td className='pt-3 border border-top-0 border-end-0 border-start-0 pb-3 text-capitalize'>tax</td>
              <td className='text-end pe-3 pt-3 border border-top-0 border-end-0 border-start-0 pb-3'>{data?.tax}</td>
            </tr>
            <tr>
              <td className='border-b-0 pt-3 text-capitalize'>total amount</td>
              <td className='text-end pe-3 pt-3'>{data?.total}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}


export default InvoiceList;