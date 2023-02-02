import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import * as Yup from 'yup';
import { Card, Row, Col, Button, Form, Table, ListGroup, Modal } from 'react-bootstrap'
import { BsX, BsExclamationCircle, BsPlus } from 'react-icons/bs'
import InvoiceDataServices from '../services/invoices.service'
import { CustomAlert, LoadingSpinner } from './Utilities';


const itemValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(5, 'itemName is too short!')
        .max(50, 'itemName is too long!')
        .required('itemName is required'),
    qty: Yup.number()
        .min(1, "quantity must be at least 1  qty")
        .max(50, "quantity must not more than 50 ")
        .required('qty is requiered'),
    price: Yup.number().min(10, "price must be at least 10 ").max(100000, "price must not more than 100000").required('price is required'),
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
    subtotal: Yup.number().required(),
    tax: Yup.number().required(),
    total: Yup.number().required(),
});


export default function Invoice() {

    const navigate = useNavigate();
    const { invid } = useParams();


    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState({ msg: "", variant: "", show: false });
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


    async function handleInvoiceFormSubmit(values) {

        try {
            if (invid) {

                setAlertMsg(prev => ({ ...prev, msg: "Updating...", variant: "info", show: true }))
                await InvoiceDataServices.updateInvoice(invid, values);
                setAlertMsg(prev => ({ ...prev, msg: "Updated", variant: "success" }))

            } else {

                setAlertMsg(prev => ({ ...prev, msg: "Creating...", variant: "info", show: true }))
                await InvoiceDataServices.addInvoices(values);
                setAlertMsg(prev => ({ ...prev, msg: "Created", variant: "success" }))

            }
            setAlertMsg(prev => ({ ...prev, msg: "", variant: "", show: false }))
            invoiceForm.resetForm();
            navigate(-1);

        } catch (error) {
            setAlertMsg(prev => ({ ...prev, msg: error, variant: "danger", show: true }))
            console.log(error);
        }

    }

    async function getInvoice() {
        setLoading(true);
        const docSnap = await InvoiceDataServices.getInvoice(invid);
        let invData = {
            name: docSnap.data().name,
            items: docSnap.data().items,
            subtotal: docSnap.data().subtotal,
            tax: docSnap.data().tax,
            total: docSnap.data().total
        };
        invoiceForm.setValues(invData);
        setLoading(false);
    }


    useEffect(() => {
        if (invid) getInvoice()
    }, []);



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



    function itemTable() {

        return (
            <>
                <Row className='my-4'>
                    <Col>
                        <FormikProvider value={invoiceForm}>
                            <FieldArray
                                name='items'
                                render={(arrayHelpers) => {
                                    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = invoiceForm;

                                    const subTotal = index => values.items.filter((itm, idx) => idx !== index).reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);

                                    const handleCustomChange = ({ currentTarget: { name, value }, index }) => {

                                        let newTotal;

                                        if (name === `items[${index}].qty`) {
                                            setFieldValue(name, value);
                                            newTotal = values.items[index].price * value
                                            setFieldValue(`items[${index}].total`, newTotal);
                                        } else {
                                            setFieldValue(name, value);
                                            newTotal = values.items[index].qty * value;
                                            setFieldValue(`items[${index}].total`, newTotal);
                                        }

                                        const prevSubTotal = subTotal(index)
                                        const newSubTotal = prevSubTotal + newTotal;

                                        setFieldValue("subtotal", newSubTotal);
                                        setFieldValue("total", newSubTotal + values.tax);

                                    }


                                    const handleRemove = index => {
                                        arrayHelpers.remove(index);
                                        const newSubTotal = subTotal(index);
                                        setFieldValue("subtotal", newSubTotal);
                                        setFieldValue("total", newSubTotal + values.tax);
                                    }


                                    return (
                                        <>
                                            <Table hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th className='text-capitalize'>item name</th>
                                                        <th className='text-capitalize text-center'>number of item</th>
                                                        <th className='text-capitalize text-center pe-4'>price</th>
                                                        <th className='text-capitalize text-center px-4'>total price</th>
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
                                                                        value={values.items[index]?.name}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        isInvalid={errors?.items && errors.items[index]?.name && touched?.items && touched?.items[index]?.name}
                                                                        errors={errors?.items && errors.items[index]?.name ? errors?.items[index]?.name : ""}
                                                                        placeholder="add name"
                                                                    />

                                                                </td>
                                                                <td>
                                                                    <InputForm
                                                                        type="number"
                                                                        name={`items[${index}].qty`}
                                                                        value={values.items[index]?.qty}
                                                                        onChange={({ currentTarget }) => handleCustomChange({ currentTarget, index })}
                                                                        onBlur={handleBlur}
                                                                        isInvalid={errors?.items && errors?.items[index]?.qty && touched?.items && touched?.items[index]?.qty}
                                                                        errors={errors?.items && errors?.items[index]?.qty ? errors?.items[index]?.qty : ""}
                                                                        placeholder="add quantity"
                                                                        className="text-center"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <InputForm
                                                                        type="number"
                                                                        name={`items[${index}].price`}
                                                                        value={values.items[index]?.price}
                                                                        onChange={({ currentTarget }) => handleCustomChange({ currentTarget, index })}
                                                                        onBlur={handleBlur}
                                                                        isInvalid={errors?.items && errors?.items[index]?.price && touched?.items && touched?.items[index]?.price}
                                                                        errors={errors?.items && errors?.items[index]?.price ? errors?.items[index]?.price : ""}
                                                                        placeholder="add price"
                                                                        className="text-center"
                                                                    />
                                                                </td>
                                                                <td className='text-end pe-5'>{values.items[index]?.total}</td>
                                                                <td onClick={() => handleRemove(index)} className='text-align-center'><BsX role={"button"} className='fs-2' /></td>
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
            <Row className='border-top border-secondary pt-4 d-flex justify-content-end'>
                <Col lg="5" md="7" className='pe-5'>
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
            <CustomAlert alertMsg={alertMsg}/>
            <Card className='mt-5'>
                <Card.Header>
                    <Card.Title>{`${invid ? "Edit" : "New"} Invoice`}</Card.Title>
                </Card.Header>
                {
                    loading ?
                        <Card.Body>
                            <LoadingSpinner />
                        </Card.Body>
                        : <>
                            <Card.Body>
                                {invoiceFormInput()}
                                {itemTable()}
                                {invoiceFooter()}
                            </Card.Body>
                            <Card.Footer>
                                <Row>
                                    <Col>
                                        <Button onClick={invoiceForm.handleSubmit} variant='secondary' className='text-capitalize'>{invid ? "update" : "create"}</Button>
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </>
                }
            </Card>
        </div>
    )
}


function InputForm({ label = "", type, name, value, onChange, onBlur, errors, isInvalid, placeholder, className = "" }) {

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
                    className={className}
                />
                <Form.Control.Feedback type="invalid" className='absolute' >
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
