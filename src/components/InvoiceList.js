import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from './LoadingSpinner'
import { BsPencil, BsTrash, BsEye } from 'react-icons/bs'
import InvoiceDataService from '../services/invoices.service'


function InvoiceList() {

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

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
                <td className='text-end pe-5'>
                  {inv?.total}
                </td>
                <td>
                  <div className='d-flex justify-content-center '>
                    <Button size='sm' variant='info' className='mx-2'>
                      <BsEye className='text-black' />
                    </Button>
                    <Link to="invoice-update" state={{ ...inv }}>
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
  );
}




function ListForm() {
  return (
    <Row >
      <Col sm="7">
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


export default InvoiceList;