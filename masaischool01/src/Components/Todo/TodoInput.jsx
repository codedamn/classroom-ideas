import React, { useState } from 'react'
import styles from './TodoInput.module.css'

const TodoInput = ({ handleSubmit }) => {
	const [text, setText] = useState('')

	const onSubmit = (e) => {
		e.preventDefault()
		handleSubmit(text)
		setText('')
	}
	return (
		<>
			<h1>Todo</h1>
			<form className={styles.container} onSubmit={onSubmit}>
				<input
					value={text}
					className={styles.inputBox}
					data-testid="input-box"
					placeholder="add something"
					onChange={(e) => setText(e.target.value)}
					type="text"
				/>
				<input
					data-testid="add-task-button"
					className={styles.button}
					value="ADD"
					type="submit"
				/>
			</form>
		</>
	)
}

export { TodoInput }
