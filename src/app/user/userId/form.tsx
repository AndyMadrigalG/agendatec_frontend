'use client'

import styles from './user.module.css';
import { updateNameAction } from './actions';
import { useFormState, useFormStatus } from 'react-dom';
import { useRef } from 'react';

export default function Form({ userId }: { userId: string }) {

    const formRef = useRef<HTMLFormElement>(null);
    const [state, action] = useFormState (updateNameAction, {
        userId,
        name: "",
        message: '',
    });

    if (state.message == "success") {
        formRef.current?.reset();
    } 

    return (
        <form ref={formRef} className={styles.form} action={action}>
            <input type='text' name='name'/>
            <BotonAceptar/>
        </form>
    );
}

export function BotonAceptar () {
    const status = useFormStatus();
    return (
        <button > {status.pending ? "Guardando..." : "Guardar"} </button>
    )
}