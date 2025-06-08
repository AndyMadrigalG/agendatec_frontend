import styles from './user.module.css';
import { getUser } from "@/app/data-access/user";
import Form from './form';

type PageProps = {
    params: {
        userId: string;
    };
};

async function UserPage({ params }: PageProps) {
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

export default UserPage;