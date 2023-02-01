import { Routes, Route, Outlet } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InvoiceList from './components/InvoiceList'
import Invoice from './components/Invoice';


function App() {

  return (
    <Container fluid >
      <Row className="justify-content-md-center">
        <Col>
          <Routes>
            <Route path='/' element={<Outlet />}>
              <Route index element={<InvoiceList />} />
              <Route path='invoice' element={<Invoice />} />
            </Route>
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}
export default App;
