import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid'
import { Card, Row, Col, Button, Form, Table, ListGroup, Modal } from 'react-bootstrap'
import { BsX, BsExclamationCircle } from 'react-icons/bs'
import InvoiceDataServices from '../services/invoices.service'


const itemValidationSchema = Yup.object({
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
    item: Yup.array(itemValidationSchema)
        .min(1, "item must have at least 1 items")
        .max(20)
        .required('item is requiered'),
    subtotal: Yup.number().required(),
    tax: Yup.number().required(),
    total: Yup.number().required(),
});

export default function Invoice() {

    const navigate = useNavigate();
    const { state } = useLocation();

    const [showErrModal, setShowErrModal] = useState(false);

    const invoiceForm = useFormik({
        initialValues: {
            name: "",
            item: [],
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


    const itemForm = useFormik({
        initialValues: { name: "", qty: "", price: "", total: "" },
        validationSchema: itemValidationSchema,
        onSubmit: handleItemFormSubmit
    });


    function handleItemFormSubmit(values) {
        alert(JSON.stringify(values, null, 2));
        const { item, tax } = invoiceForm.values
        let prevSubTotal = item.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
        invoiceForm.setFieldValue("item", [...item, { ...values, id: uuidv4() }]);
        itemForm.resetForm();
        let newSubTotal = prevSubTotal + values.total;
        invoiceForm.setFieldValue("subtotal", newSubTotal);
        invoiceForm.setFieldValue("total", newSubTotal + tax);
    }


    useEffect(() => {
        if (state) invoiceForm.setValues(state)
    }, []);


    function itemTable() {

        const { values, errors, touched, handleChange, handleBlur, setFieldValue } = itemForm;

        const handleCustomChange = ({ currentTarget: { name, value } }) => {
            if (name === "qty") {
                setFieldValue(name, value);
                setFieldValue("total", values.price * value);
            } else {
                setFieldValue(name, value);
                setFieldValue("total", values.qty * value);
            }
        }

        const handleItemDelete = (itm) => {

            const { values: { item }, setFieldValue } = invoiceForm;

            const filterResult = item.filter(i => i.id !== itm.id && i.name !== itm.name);

            setFieldValue("item", filterResult);
        }

        return (
            <>
                <Row className='my-4'>
                    <Col>
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
                                {(Array.isArray(invoiceForm.values.item) && invoiceForm.values.item.length) ?
                                    invoiceForm.values.item.map((itm, index) => (
                                        <tr key={index}>
                                            <td>{itm.name}</td>
                                            <td className='text-center'>{itm.qty}</td>
                                            <td className=''>
                                                <div className='d-flex justify-content-center align-item-center text-end'>
                                                    {itm.price}
                                                </div>
                                            </td>
                                            <td className='text-end pe-4'>
                                                <div className='d-flex justify-content-center  text-end'>
                                                    {itm.total}
                                                </div>
                                            </td>
                                            <td className='text-center px-5'>
                                                <BsX onClick={() => handleItemDelete(itm)} role={"button"} className='fs-2' />
                                            </td>
                                        </tr>

                                    )) : ""}
                                <tr>
                                    <td>
                                        <InputForm
                                            type="text"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
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
                                            onChange={handleCustomChange}
                                            onBlur={handleBlur}
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
                                            onChange={handleCustomChange}
                                            onBlur={handleBlur}
                                            errors={errors.price}
                                            isInvalid={errors.price && touched.price}
                                            placeholder="enter price"
                                        />
                                    </td>
                                    <td>{values.total}</td>
                                    <td onClick={() => { }} className='text-align-center'><BsX role={"button"} className='fs-2 d-none' /></td>
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
                    <Button onClick={itemForm.handleSubmit} variant='info' className='mb-4'>Add item</Button>
                </Col>
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
