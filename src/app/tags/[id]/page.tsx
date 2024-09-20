const TodoTags = ({ params }: { params: { id: string } }) => {
    const todoId = params.id;

    return (
        <p>todoのidは: {todoId}</p>
    )
}

export default TodoTags;
