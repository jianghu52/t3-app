export type Owner = {
    email: string | null;
    name: string | null;
    id:string | null;
}

export type TodoEntry = {
    id: number;
    title: string;
    description: string;
    owner: Owner;
    createdAt: Date;
    updatedAt: Date;
}

export type EditingTodo = number | null;