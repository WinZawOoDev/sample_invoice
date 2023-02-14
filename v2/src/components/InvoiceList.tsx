import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { BsPencil, BsTrash, BsEye } from 'react-icons/bs'
import { FaFileCsv } from 'react-icons/fa'
import InvoiceDataService from '../services/invoices.service'
import { CustomAlert, AlertMessage, LoadingSpinner } from './Utilities';



interface Items {
  name: string,
  price: number,
  qty: number,
  total: number
}

interface Invoices {
  id?: string,
  name: string,
  items: Items[],
  subtotal: number,
  tax: number,
  total: number
}


function InvoiceList(): JSX.Element {

  const [invoices, setInvoices] = useState<Invoices[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertMsg, setAlertMsg] = useState<AlertMessage>({ msg: "", variant: "", show: false });

  const [viewInv, setViewInv] = useState<{ show: boolean, data: Invoices }>({ show: false, data: {} as Invoices });
  const [typeaheadLoading, setTypeheadLoading] = useState<boolean>(false);
  const [typeaheadOptions, setTypeaheadOptions] = useState<Invoices[]>([]);

  const getInvoices = async (): Promise<void> => {
    setLoading(true);

    const data = await InvoiceDataService.getAllInvoices();

    setInvoices(data.docs.map((doc): any => ({ ...doc.data(), id: doc.id })));

    setLoading(false);
  }

  useEffect(() => {
    getInvoices();
  }, []);


  const handleInvDelete = async (id: string): Promise<void> => {
    setAlertMsg((prev) => ({ ...prev, msg: "Deleting...", variant: "danger", show: true }))
    await InvoiceDataService.deleteInvoice(id);
    setAlertMsg((prev) => ({ ...prev, msg: "Deleted...", variant: "success", show: false }))
    getInvoices();
  }

  const handleInvView = (id: string): void => {
    const inv = invoices.find(inv => inv.id === id)!;
    setViewInv((prev) => ({ ...prev, show: true, data: inv }))
  }

  const handleSearch = async (query: string): Promise<void> => {
    setTypeheadLoading(true);
    const invDoc = await InvoiceDataService.searchInvoice(query)
    setTypeaheadOptions(invDoc.docs.map((doc): any => ({ ...doc.data(), id: doc.id })));
    setTypeheadLoading(false);
  }

  const formatCSV = (inv: Invoices): string => {

    let dataStr = `ItemName,Quantity,Price,TotalPrice\n`;
    inv.items.forEach(item => {
      dataStr += `${item.name},${item.qty},${item.price},${item.total},\n`;
    });
    dataStr += `,,Subtotal,${inv.subtotal}\n,,Tax,${inv.tax}\n,,TotalAmount,${inv.total}\n`;

    return dataStr;
  }

  function dataTable(): JSX.Element {
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
                    <span role="button" onClick={() => handleInvView(inv.id!)} className='mx-2'>
                      <BsEye className='text-info fs-5' />
                    </span>
                    <Link to={`invoice-update/invid/${inv.id}`}>
                      <span role="button" className='mx-2'>
                        <BsPencil className='text-secondary fx-4' />
                      </span>
                    </Link>
                    <span role="button" onClick={() => handleInvDelete(inv.id!)} className='mx-2'>
                      <BsTrash className='text-danger fs-5' />
                    </span>
                    <CSVLink
                      filename={inv.name}
                      data={formatCSV(inv)}
                    >
                      <span role="button" className='mx-2'>
                        <FaFileCsv className='fs-4 text-success' />
                      </span>
                    </CSVLink>
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
      <CustomAlert alertMsg={alertMsg} />
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
            loading ? <LoadingSpinner />
              : invoices.length === 0 ?
                <NoDataView /> :
                (
                  <>
                    <SearchForm
                      options={typeaheadOptions}
                      isLoading={typeaheadLoading}
                      handleSearch={handleSearch}
                      setInvoices={setInvoices}
                    />
                    {dataTable()}
                  </>
                )
          }
        </Card.Body>
      </Card>
      <ViewInvoice show={viewInv.show} onHide={() => setViewInv(prev => ({ ...prev, show: false, data: {} as Invoices }))} data={viewInv.data} />
    </>
  );
}



function SearchForm(
  { options, isLoading, handleSearch, setInvoices }:
    { options: Invoices[], isLoading: boolean, handleSearch: (value: string) => void, setInvoices: React.Dispatch<React.SetStateAction<Invoices[]>> }): JSX.Element {
  return (
    <Row >
      <Col lg="4" md="6">
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>
              Search Invoice
            </Form.Label>
            <AsyncTypeahead
              id="async-typeahead"
              labelKey="name"
              isLoading={isLoading}
              minLength={4}
              options={options}
              placeholder="Search for a invoice name..."
              onSearch={handleSearch}
              renderMenuItemChildren={(option: any) => (<span role="button" onClick={() => setInvoices([option])}>{option.name}</span>)}
            />

          </Form.Group>
        </Form>
      </Col>
    </Row>
  )
}





function ViewInvoice({ show, onHide, data }: { show: boolean, onHide: () => void, data: Invoices }): JSX.Element {

  if (!show) return <></>;

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
              <th className='text-center border border-top-0 border-end-0 border-start-0'>Quantity</th>
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
              <th rowSpan={4} colSpan={2} className='border border-bottom-0 border-end-0 border-start-0'></th>
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


function NoDataView(): JSX.Element {
  return (
    <div className='d-flex justify-content-center align-items-center p-5 bg-secondary'>
      <span className='fs-5'>There is no invoce please create new invoce!</span>
    </div>
  )
}

export default InvoiceList;