import { db, auth } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp, deleteDoc, doc, getDoc } from "firebase/firestore";
import { Options } from "qr-code-styling";
import { QRFrameOptions } from "@/types/qr";

export interface SavedQR {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  createdAt: any;
}

export interface SavedPreset {
  id: string;
  userId: string;
  name: string;
  config: Options;
  frame: QRFrameOptions;
  createdAt: any;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const archiveService = {
  async saveQRCode(name: string, imageUrl: string) {
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    const path = "qrcodes";
    const qrData = {
      userId: auth.currentUser.uid,
      name,
      imageUrl,
      createdAt: serverTimestamp(),
    };
    
    try {
      const docRef = await addDoc(collection(db, path), qrData);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async savePreset(name: string, config: Options, frame: QRFrameOptions) {
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    const path = "presets";
    const presetData = {
      userId: auth.currentUser.uid,
      name,
      config,
      frame,
      createdAt: serverTimestamp(),
    };
    
    try {
      const docRef = await addDoc(collection(db, path), presetData);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getSavedQRCodes(): Promise<SavedQR[]> {
    if (!auth.currentUser) return [];
    
    const path = "qrcodes";
    try {
      const q = query(collection(db, path), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedQR[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async getPresets(): Promise<SavedPreset[]> {
    if (!auth.currentUser) return [];
    
    const path = "presets";
    try {
      const q = query(collection(db, path), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedPreset[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async deleteQRCode(id: string) {
    const path = `qrcodes/${id}`;
    try {
      await deleteDoc(doc(db, "qrcodes", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async deletePreset(id: string) {
    const path = `presets/${id}`;
    try {
      await deleteDoc(doc(db, "presets", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
