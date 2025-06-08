"use server";

import { updateUser } from '@/app/data-acess/user';
import { revalidatePath } from 'next/cache';



export async function updateNameAction (prevState: {
    userId: string;
}, formData: FormData) {

    //await new Promise((resolve) => setTimeout(resolve, 1000));

    const userId = prevState.userId;
    const newName = formData.get("name") as string;
    await updateUser(userId, newName);
    revalidatePath('/user/${userId}');

    return{
        userId: userId,
        name: "",
        message: "success"
    }

}