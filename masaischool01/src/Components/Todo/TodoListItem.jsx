import React from 'react'
import styles from './TodoItem.module.css'

const TodoListItem = ({ title, id, status, handleToggle, handleDelete }) => {
	return (
		<div className={styles.itemContainer} data-testid="list-todo">
			<div data-testid="item-title"> {title} </div>
			<div className={styles.rightBox}>
				<div
					data-testid="item-status"
					onClick={() => handleToggle(id, status)}
					className={`${styles.statusCircle} ${status ? styles.done : styles.pending}`}
				></div>
				<div>
					<img
						// onClick={() => handleDelete(id)}
						data-testid="item-delete"
						width="20px"
						src="https://pics.freeicons.io/uploads/icons/png/9739889771543238875-512.png"
						alt="delete"
						onClick={() => handleDelete(id)}
					/>
				</div>
			</div>
		</div>
	)
}

export default TodoListItem
