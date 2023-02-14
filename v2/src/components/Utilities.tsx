
import React from 'react'
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


export interface AlertMessage { msg: string, variant: string, show: boolean }

export function CustomAlert({ alertMsg: { msg, variant, show } }: { alertMsg: AlertMessage }): JSX.Element {
    return (
        <Alert show={show} variant={variant} role="alert" className='my-5'>
            <p className='px-5'>
                {msg}
            </p>
        </Alert>
    )
}

