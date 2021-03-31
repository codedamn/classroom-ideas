import React from 'react'
import TodoListItem from './TodoListItem'

const TodoList = ({ data, handleToggle, handleDelete }) => {
	if (!data) {
		throw new Error(`${data} is empty`)
	}
	return (
		<div>
			{data?.map((item) => {
				return (
					<TodoListItem
						key={item.id}
						handleDelete={handleDelete}
						handleToggle={handleToggle}
						{...item}
					/>
				)
			})}
		</div>
	)
}

export default TodoList
