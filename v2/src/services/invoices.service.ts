
import { db } from "../firebaseConfig";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where
} from "firebase/firestore";
import {Invoice} from '../interfaces/Invoice'


const invoiceCollectionRef = collection(db, "invoices")

class InvoiceDataService {


    addInvoices = (newInvoice: Invoice) => addDoc(invoiceCollectionRef, newInvoice);


    updateInvoice = (id: string, updatedInvoice: any) => {
        const invDoc = doc(db, "invoices", id);
        return updateDoc(invDoc, updatedInvoice);
    }


    deleteInvoice = (id: string) => {
        const invDoc = doc(db, "invoices", id);
        return deleteDoc(invDoc);
    }


    getAllInvoices = () => getDocs(invoiceCollectionRef);


    getInvoice = (id: string ) => {
        const invDoc = doc(db, "invoices", id);
        return getDoc(invDoc);
    }

    searchInvoice = (queryName: string) => {
        const invQuery = query(invoiceCollectionRef, where("name", "==", queryName));
        return getDocs(invQuery);
    }


}

export default new InvoiceDataService();