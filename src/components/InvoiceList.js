import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

function InvoiceList() {
  return (
    <Card className='mt-5'>
      <Card.Header>
        <Card.Title>
          <span className='h3'>Invoce list</span>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <ListForm />
        <DataTable />
      </Card.Body>
    </Card>
  );
}


function DataTable() {
  return (<Table striped bordered hover>
    <thead>
      <tr>
        <th>#</th>
        <th>Invoice Name</th>
        <th>Invoice Number</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
    </tbody>
  </Table>)
}


function ListForm() {
  return (
    <Row>
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
      <Col>
        <Link to="invoice">
          <Button variant="outline-primary">Create New Invoice</Button>
        </Link>
      </Col>
    </Row>
  )
}

export default InvoiceList;