import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const INITIAL_REFERENCE = 410000;

export const getNextReferenceNumber = async () => {
  try {
    const q = query(
      collection(db, 'quotes'), 
      orderBy('referenceNumber', 'desc'),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return INITIAL_REFERENCE;
    }

    const lastQuote = snapshot.docs[0].data();
    const lastReference = parseInt(lastQuote.referenceNumber);
    
    return lastReference + 1;
  } catch (error) {
    console.error('Error getting next reference number:', error);
    return INITIAL_REFERENCE;
  }
};
