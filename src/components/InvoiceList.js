import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InvoiceDataService from '../services/invoices.service'


function InvoiceList() {


  const [invoices, setInvoices] = useState([]);

  const getInvoices = async () => {
    const data = await InvoiceDataService.getAllInvoices();
    setInvoices(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  }

  useEffect(() => {
    getInvoices();
  }, []);



  function dataTable() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Invoice Name</th>
            <th className='text-center'>Numbers of Items</th>
            <th className='text-center'>Amount</th>
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
                  {inv?.item.length}
                </td>
                <td className='text-end pe-5'>
                  {inv?.total}
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }


  return (
    <Card className='mt-5'>
      <Card.Header>
        <Card.Title>
          <span className='h3'>Invoce list</span>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <ListForm />
        {dataTable()}
      </Card.Body>
    </Card>
  );
}




function ListForm() {
  return (
    <Row >
      <Col>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>
              Search Invoice
            </Form.Label>
            <Form.Control type='text' placeholder="Enter invoice Number" />
          </Form.Group>
        </Form>
      </Col>
      <Col className='position-relative '>
        <div className='d-flex justify-content-end align-items-baseline'>
          <Link to="invoice">
            <Button variant="outline-primary">Create New Invoice</Button>
          </Link>
        </div>
      </Col>
    </Row>
  )
}

export default InvoiceList;