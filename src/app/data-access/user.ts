// This file is part of the "Data Access Layer" for user management.
// user.ts
type User = {
    id: string;
    name: string;
};

const user_example: User = {
    id: "50",
    name: "Javi Diaz",
}

export async function getUser(userId: string){
    console.log('Buscando userId' + userId);
    return user_example;
}

export async function updateUser(userId: string, name: string){
    console.log('Actualizando usuario ' + userId);
    user_example.name = name;
}