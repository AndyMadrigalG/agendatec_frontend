import styles from './user.module.css';
import { getUser } from "../../data-acess/user";
import Form from './form';

export default async function UserPage({
    params,
}: {
    params: {
        userId: string;
    };
}) {

    const user = await getUser(params.userId);
    
    return (
        <main className={styles.main}>
            
            <div className={styles.div}>
                <h1>Usuario {user.name}</h1>
                <Form userId = {user.id}/>
            </div>
        </main>
    );
}