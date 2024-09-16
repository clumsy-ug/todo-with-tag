export interface User {
    id: string,
    email: string,
    created_at?: Date
}

export interface Todo {
    id: string,
    user_id: string,
    content: string,
    created_at?: string
}

export interface Tag {
    id: string,
    name: string
}

export interface Todo_Tag {
    todo_id: string,
    tag_id: string
}
