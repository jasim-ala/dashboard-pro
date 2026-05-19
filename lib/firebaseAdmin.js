import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Safely handle escaped newlines in the private key
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

function getFirebaseAdmin() {
  if (!getApps().length) {
    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('[Firebase] Admin SDK initialized successfully');
    } else {
      console.warn('[Firebase] Credentials missing. Running in mock/fallback mode.');
    }
  }
  
  // Provide firestore instance if initialized, or mock fallback to avoid crashing during build/missing variables
  try {
    return {
      db: getFirestore(),
      FieldValue
    };
  } catch (error) {
    console.error('[Firebase] Failed to get Firestore instance:', error.message);
    return {
      db: null,
      FieldValue: {
        serverTimestamp: () => new Date()
      }
    };
  }
}

export const { db, FieldValue } = getFirebaseAdmin();
export { getApps };
