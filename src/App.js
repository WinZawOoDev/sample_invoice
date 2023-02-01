import { Routes, Route, Outlet } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InvoiceList from './components/InvoiceList'
import Invoice from './components/Invoice';
import InvoiceV2 from './components/InvoiceV2'


function App() {

  return (
    <Container fluid >
      <Row className="justify-content-md-center">
        <Col lg="10">
          <Routes>
            <Route path='/' element={<Outlet />}>
              <Route index element={<InvoiceList />} />
              <Route path='invoice-create' element={<InvoiceV2 />} />
              <Route path='invoice-update' element={<Invoice/>}/>
            </Route>
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}
export default App;
