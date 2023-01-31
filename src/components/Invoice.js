import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { Card, Row, Col, Button, FormGroup, Form, Table, ListGroup } from 'react-bootstrap'
import { BsX } from 'react-icons/bs'

export default function Invoice() {

    const [invoiceData, setInvoiceData] = useState({
        name: "",
        item: [],
        subtotal: "",
        text: "",
        total: ""
    });


    const itemForm = useFormik({
        initialValues: { name: "", qty: "", price: "", total: "" },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .min(5, 'name is too short!')
                .max(50, 'name is too long!')
                .required('name is required'),
            qty: Yup.number()
                .min(1)
                .max(50)
                .required('qty is requiered'),
            price: Yup.number().min(10).max(9999).required('price is required'),
            total: Yup.number().required("total is required")
        }),
        onSubmit: handleFormSubmit
    });


    function handleFormSubmit(values) {
        alert(JSON.stringify(values, null, 2))
        itemForm.resetForm();
    }


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

        const { values, errors, touched, handleChange, setFieldValue } = itemForm;

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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <InputForm
                                            type="text"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            errors={errors.name}
                                            isInvalid={errors.name && touched.name}
                                            placeholder="enter item name"
                                        />
                                    </td>
                                    <td>
                                        <InputForm
                                            type="number"
                                            name="qty"
                                            value={values.qty}
                                            onChange={({ currentTarget: { value } }) => {
                                                setFieldValue("qty", value);
                                                setFieldValue("total", values.price * value);
                                            }}
                                            errors={errors.qty}
                                            isInvalid={errors.qty && touched.qty}
                                            placeholder="enter quantity"
                                        />
                                    </td>
                                    <td>
                                        <InputForm
                                            type="number"
                                            name="price"
                                            value={values.price}
                                            onChange={({ currentTarget: { value } }) => {
                                                setFieldValue("price", value)
                                                setFieldValue("total", values.qty * value)
                                            }}
                                            errors={errors.price}
                                            isInvalid={errors.price && touched.price}
                                            placeholder="enter price"
                                        />
                                    </td>
                                    <td>{values.total}</td>
                                    <td className='text-align-center'><BsX className='' /></td>
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
            <Row className='border-top border-secondary pt-4'>
                <Col>
                    <Button onClick={itemForm.handleSubmit} className='primary mb-4'>Add item</Button>
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
                                <div className="fw-bold">Tax</div>
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



function InputForm({ type, name, value, onChange, errors, isInvalid, placeholder }) {
    return (
        <Form noValidate>
            <Form.Group>
                <Form.Control
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    isInvalid={isInvalid}
                    controlid="validationCustom05"
                    placeholder={placeholder}
                />
                <Form.Control.Feedback type="invalid" className='absolutee' >
                    {errors}
                </Form.Control.Feedback>
            </Form.Group>
        </Form>
    )
}


