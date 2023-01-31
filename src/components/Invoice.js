import React from 'react'
import { Card, Row, Col, Button, FormGroup, Form, Table, ListGroup } from 'react-bootstrap'
import { BsX } from 'react-icons/bs'

export default function Invoice() {



    function invoiceName() {
        return (
            <Form>
                <FormGroup as={Row}>
                    <Form.Label>
                        Invoice Name
                    </Form.Label>
                    <Col sm="7">
                        <Form.Control type='text' placeholder='Add new invoice name' />
                    </Col>
                </FormGroup>
            </Form>
        )
    }


    function itemTable() {

        const FormControl = ({ type }) => (
            <Form>
                <Col sm="auto">
                    <Form.Control type={type} />
                </Col>
            </Form>
        )

        return (
            <>
                <Row className='my-4'>
                    <Col>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>item name</th>
                                    <th>number of item</th>
                                    <th>price</th>
                                    <th>total</th>
                                    <th>action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><FormControl type="text" /></td>
                                    <td><FormControl type="text" /></td>
                                    <td><FormControl type="number" /></td>
                                    <td>0</td>
                                    <td><BsX className='' /></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>

            </>

        )
    }


    function invoiceFooter() {
        return (
            <Row>
                <Col>
                    <Button className='primary mb-4'>Add item</Button>
                </Col>
                <Col>
                    <ListGroup as="ol">
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start py-3 border-0"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Subtotal</div>
                            </div>
                            <div>
                                <span>000</span>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start  py-3 border-0"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Text</div>
                            </div>
                            <div>
                                <span>000</span>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start  py-3 border-0"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Total</div>
                            </div>
                            <div>
                                <span>000</span>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        )
    }



    return (
        <Card className='mt-5'>
            <Card.Header>
                <Card.Title>New Invoice</Card.Title>
            </Card.Header>
            <Card.Body>
                {invoiceName()}
                {itemTable()}
                {invoiceFooter()}
            </Card.Body>
            <Card.Footer>
                <Row>
                    <Col>
                        <Button variant='secondary'>Create</Button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    )
}



