
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


const invoiceCollectionRef = collection(db, "invoices")

class InvoiceDataService {


    addInvoices = (newInvoice) => addDoc(invoiceCollectionRef, newInvoice);


    updateInvoice = (id, updatedInvoice) => {
        const invDoc = doc(db, "invoices", id);
        return updateDoc(invDoc, updatedInvoice);
    }


    deleteInvoice = (id) => {
        const invDoc = doc(db, "invoices", id);
        return deleteDoc(invDoc);
    }


    getAllInvoices = () => getDocs(invoiceCollectionRef);


    getInvoice = (id) => {
        const invDoc = doc(db, "invoices", id);
        return getDoc(invDoc);
    }

    searchInvoice = (queryName) => {
        const invQuery = query(invoiceCollectionRef, where("name", "==", queryName));
        return getDocs(invQuery);
    }


}

export default new InvoiceDataService();