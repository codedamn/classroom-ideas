import styles from './Pagination.module.css'

const Pagination = ({ currentPage, onChange, pageLinks = {} }) => {
	const { first, next, last, prev } = pageLinks

	return (
		<div className={styles.container}>
			<button data-testid="button-first" disabled={!first} onClick={() => onChange(first)}>
				First
			</button>
			<button
				data-testid="button-prev"
				disabled={!prev || Number(currentPage) === 1}
				onClick={() => onChange(prev)}
			>
				Prev
			</button>
			<button data-testid="button-current">{currentPage}</button>
			<button data-testid="button-next" disabled={!next} onClick={() => onChange(next)}>
				Next
			</button>
			<button data-testid="button-last" disabled={!last} onClick={() => onChange(last)}>
				Last
			</button>
		</div>
	)
}

export { Pagination }
