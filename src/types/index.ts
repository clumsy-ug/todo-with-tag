export interface Todo {
    id?: string,
    user_id: string,
    content: string,
    created_at?: string
}

export interface TagId {
    tag_id: string
}

export interface Tag {
    id: string,
    name: string
}
