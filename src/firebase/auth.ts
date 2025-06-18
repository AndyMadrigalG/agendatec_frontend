import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updatePassword
} from 'firebase/auth';

export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
    return auth.signOut();
};

export const doPasswordReset = (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password: string) => {
    if (auth.currentUser) {
        return updatePassword(auth.currentUser, password);
    } else {
        throw new Error('No hay un usuario autenticado.');
    }
};

export const doSendEmailVerification = () => {
    if (auth.currentUser) {
        return sendEmailVerification(auth.currentUser);
    } else {
        throw new Error('No hay un usuario autenticado.');
    }
};