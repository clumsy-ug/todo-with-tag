export interface Todo {
    id?: string,
    user_id: string,
    content: string,
    created_at?: string
}

export interface Tag_id {
    tag_id: string
}

export interface Todo_id {
    todo_id: string
}

export interface Id {
    id: string
}

export interface Tag {
    id: string,
    name: string
}
