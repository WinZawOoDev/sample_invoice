
import Alert from 'react-bootstrap/Alert'

export function LoadingSpinner() {
    return (
        <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}


export function CustomAlert({ alertMsg }) {
    return (
        <Alert show={alertMsg.show} variant={alertMsg.variant} role="alert" className='my-5'>
            <p className='px-5'>
                {alertMsg.msg}
            </p>
        </Alert>
    )
}