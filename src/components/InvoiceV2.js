import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import * as Yup from 'yup';
import { Card, Row, Col, Button, Form, Table, ListGroup, Modal } from 'react-bootstrap'
import { BsX, BsExclamationCircle, BsPlus } from 'react-icons/bs'
import InvoiceDataServices from '../services/invoices.service'


const itemValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(5, 'itemName is too short!')
        .max(50, 'itemName is too long!')
        .required('itemName is required'),
    qty: Yup.number()
        .min(1)
        .max(50)
        .required('qty is requiered'),
    price: Yup.number().min(10).max(9999).required('price is required'),
    total: Yup.number().required("total is required")
});


const invoiceValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(5, 'invoiceName is too short!')
        .max(60, 'invoiceName is too long!')
        .required('invoiceName is required'),
    items: Yup.array().of(itemValidationSchema)
        .min(1, "item must have at least 1 items")
        .max(20)
        .required('item is requiered'),
    // subtotal: Yup.number().required(),
    // tax: Yup.number().required(),
    // total: Yup.number().required(),
});


export default function Invoice() {

    const navigate = useNavigate();
    const { state } = useLocation();

    const [showErrModal, setShowErrModal] = useState(false);

    const invoiceForm = useFormik({
        initialValues: {
            name: "",
            items: [],
            subtotal: "",
            tax: 25.00,
            total: ""
        },
        validationSchema: invoiceValidationSchema,
        onSubmit: handleInvoiceFormSubmit
    });


    function invoiceFormInput() {
        const { values, touched, errors, handleChange, handleBlur } = invoiceForm;
        return (
            <>
                <Row>
                    <Col sm="6" lg="3">
                        <InputForm
                            label='Invoice Name'
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errors={errors.name}
                            isInvalid={touched.name && errors.name}
                            placeholder="enter invoice name"
                        />
                    </Col>
                </Row>
                <ErrorModal show={showErrModal} onHide={() => setShowErrModal(false)}>
                    <span className='text-danger'>
                        item must have at least 1 items
                    </span>
                </ErrorModal>
            </>

        );
    }


    async function handleInvoiceFormSubmit(values) {

        if (Array.isArray(values.item) && !values.item.length) {
            setShowErrModal(true);
            return;
        }

        alert(JSON.stringify(values), null, 2);

        await InvoiceDataServices.addInvoices(values);

        invoiceForm.resetForm();

        navigate(-1);
    }

    function itemTable() {

        return (
            <>
                <Row className='my-4'>
                    <Col>
                        <FormikProvider value={invoiceForm}>
                            <FieldArray
                                name='items'
                                render={(arrayHelpers) => {
                                    const { values, errors, handleChange, handleBlur, setFieldValue } = invoiceForm;

                                    const handleCustomChange = ({ currentTarget: { name, value }, index }) => {
                                        if (name === "qty") {
                                            setFieldValue(name, value);
                                            setFieldValue(`items[${index}].total`, values.items[index].price * value);
                                        } else {
                                            setFieldValue(name, value);
                                            setFieldValue(`items[${index}].total`, values.items[index].qty * value);
                                        }
                                    }

                                    return (
                                        <>
                                            {/* {console.log(invoiceForm)} */}
                                            <Table hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th className='text-capitalize'>item name</th>
                                                        <th className='text-capitalize text-center'>number of item</th>
                                                        <th className='text-capitalize text-center pe-4'>price</th>
                                                        <th className='text-capitalize text-center pe-4'>total</th>
                                                        <th className='text-capitalize text-center'></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        invoiceForm.values.items?.map((itm, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <InputForm
                                                                        type="text"
                                                                        name={`items[${index}].name`}
                                                                        value={values.items[index].name}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        // errors={invoiceForm.errors.items[index].name}
                                                                        // isInvalid={invoiceForm.errors.items[index].name && invoiceForm.touched.items[index].name}
                                                                        placeholder="add name"
                                                                    />

                                                                </td>
                                                                <td>
                                                                    <InputForm
                                                                        type="number"
                                                                        name={`items[${index}].qty`}
                                                                        value={values.items[index].qty}
                                                                        onChange={(e) => handleCustomChange({currentTarget: e.currentTarget, index})}
                                                                        onBlur={handleBlur}
                                                                        // errors={invoiceForm.errors.items[index].qty}
                                                                        // isInvalid={invoiceForm.errors.items[index].qty && invoiceForm.touched.items[index].qty}
                                                                        placeholder="add quantity"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <InputForm
                                                                        type="number"
                                                                        name={`items[${index}].price`}
                                                                        value={values.items[index].price}
                                                                        onChange={({ currentTarget }) => {
                                                                            setFieldValue(currentTarget["name"], currentTarget["value"]);
                                                                            setFieldValue(`items[${index}].total`, values.items[index].qty * currentTarget["value"]);
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                        // errors={invoiceForm.errors.items[index].price}
                                                                        // isInvalid={invoiceForm.errors.items[index].price && invoiceForm.touched.items[index].price}
                                                                        placeholder="add price"
                                                                    />
                                                                </td>
                                                                <td>{invoiceForm.values.items[index].total}</td>
                                                                <td onClick={() => arrayHelpers.remove(index)} className='text-align-center'><BsX role={"button"} className='fs-2' /></td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </Table>
                                            <Button onClick={() => arrayHelpers.push({ name: "", qty: "", price: "", total: "" })} variant='primary'><BsPlus className='fs-3' /><span>row</span></Button>
                                        </>
                                    )
                                }}
                            />
                        </FormikProvider>


                    </Col>
                </Row>

            </>

        )
    }




    function invoiceFooter() {
        return (
            <Row className='border-top border-secondary pt-4'>
                {/* <Col>
                    <Button onClick={itemForm.handleSubmit} variant='info' className='mb-4'>Add item</Button>
                </Col> */}
                <Col>
                    <ListGroup as="ol" className='me-5'>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start py-3 border-0"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Subtotal</div>
                            </div>
                            <div>
                                <span>{invoiceForm.values.subtotal}</span>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start  py-3 border-end-0 border-start-0"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Tax</div>
                            </div>
                            <div>
                                <span>{invoiceForm.values.tax}</span>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start py-3 border-0"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Total Amount</div>
                            </div>
                            <div>
                                <span>{invoiceForm.values.total}</span>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        )
    }

    return (
        <div className='mx-5'>
            <Card className='mt-5'>
                <Card.Header>
                    <Card.Title>Invoice</Card.Title>
                </Card.Header>
                <Card.Body>
                    {invoiceFormInput()}
                    {itemTable()}
                    {invoiceFooter()}
                </Card.Body>
                <Card.Footer>
                    <Row>
                        <Col>
                            <Button onClick={invoiceForm.handleSubmit} variant='secondary' className='text-capitalize'>create</Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </div>
    )
}



function InputForm({ label = "", type, name, value, onChange, onBlur, errors, isInvalid, placeholder }) {

    return (
        <Form noValidate>
            <Form.Group>
                {(label !== "") && <Form.Label>{label}</Form.Label>}
                <Form.Control
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
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



function ErrorModal({ show, onHide, children }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            backdrop="static"
        >
            <Modal.Header closeButton>
                <BsExclamationCircle className='fs-3 text-danger' />
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide} size='sm'>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
