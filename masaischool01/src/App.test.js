import { render, fireEvent, cleanup, waitFor, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from './App'
import Todo from './Components/Todo/Todo'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const testIds = {
	firstButton: 'button-first',
	nextButton: 'button-next',
	lastButton: 'button-last',
	prevButton: 'button-prev',
	currentButton: 'button-current',
	listTodo: 'list-todo',
	errorTasks: 'error-tasks',
	inputBox: 'input-box',
	addButton: 'add-task-button',
	spinner: 'spinner-element',
	itemTitle: 'item-title'
}

const makeTodos = (numberOfTodos) =>
	Array.from({ length: numberOfTodos }, (_, id) => ({
		title: `Title ${id}`,
		status: id % 2,
		id
	}))

describe('test', () => {
	let mocker
	beforeEach(() => {
		mocker = new MockAdapter(axios)
	})

	afterEach(cleanup)
	test('App renders correctly', async () => {
		const todoData = makeTodos(2)
		mocker
			.onGet('https://json-server-mocker-masai.herokuapp.com/tasks', {
				params: {
					_page: 1,
					_limit: 5
				}
			})
			.reply(200, todoData, {
				link: `<http://json-server-mocker-masai.herokuapp.com/tasks?_page=1&_limit=5>; rel="first", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=2&_limit=5>; rel="next", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=2&_limit=5>; rel="last"`
			})

		const { getByTestId, findAllByTestId, findByText } = render(<App />)

		const firstButton = getByTestId(testIds.firstButton)
		expect(firstButton).toHaveTextContent('First')

		const lastButton = getByTestId(testIds.lastButton)
		expect(lastButton).toHaveTextContent('Last')

		const prevButton = getByTestId(testIds.prevButton)
		expect(prevButton).toHaveTextContent('Prev')

		const nextButton = getByTestId(testIds.nextButton)
		expect(nextButton).toHaveTextContent('Next')

		const currentButton = getByTestId(testIds.currentButton)
		expect(currentButton).toHaveTextContent('1')

		const spinner = getByTestId(testIds.spinner)
		expect(spinner).toBeInTheDocument()

		const elems = await findAllByTestId(testIds.listTodo)
		expect(elems.length).toBe(2)
	})

	test('Error is handled correctly if get tasks api fails', async () => {
		const todoData = makeTodos(2)
		mocker
			.onGet('https://json-server-mocker-masai.herokuapp.com/tasks', {
				params: {
					_page: 1,
					_limit: 5
				}
			})
			.reply(404)

		const { findByTestId } = render(<App />)

		const elem = await findByTestId(testIds.errorTasks)
		expect(elem).toHaveTextContent('Error')
	})

	test('Task Input components are present and user can add a new task', async () => {
		const { getByTestId, findAllByTestId } = render(<App />)
		const todoData = makeTodos(2)
		const text = 'LEARN REACT'
		const payload = {
			id: todoData.length,
			title: text,
			status: false
		}
		mocker
			.onGet('https://json-server-mocker-masai.herokuapp.com/tasks', {
				params: {
					_page: 1,
					_limit: 5
				}
			})
			.reply(200, todoData, {
				link: `<http://json-server-mocker-masai.herokuapp.com/tasks?_page=1&_limit=5>; rel="first", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=2&_limit=5>; rel="next", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=2&_limit=5>; rel="last"`
			})

		const inputBox = getByTestId(testIds.inputBox)
		expect(inputBox.placeholder).toBe('add something')
		fireEvent.change(inputBox, {
			target: {
				value: text
			}
		})

		const addButton = getByTestId(testIds.addButton)
		expect(addButton.value).toBe('ADD')

		mocker.onPost('https://json-server-mocker-masai.herokuapp.com/tasks').reply(201, payload)

		act(() => {
			mocker
				.onGet('https://json-server-mocker-masai.herokuapp.com/tasks', {
					params: {
						_page: 1,
						_limit: 5
					}
				})
				.reply(200, [...todoData, payload], {
					link: `<http://json-server-mocker-masai.herokuapp.com/tasks?_page=1&_limit=5>; rel="first", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=2&_limit=5>; rel="next", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=2&_limit=5>; rel="last"`
				})
			addButton.click()
		})

		const elems = await findAllByTestId(testIds.listTodo)
		expect(elems.length).toBe(3)
	})

	test('Pagination works as expected', async () => {
		const todoData = makeTodos(10)
		mocker
			.onGet('https://json-server-mocker-masai.herokuapp.com/tasks', {
				params: {
					_page: 1,
					_limit: 5
				}
			})
			.reply(200, todoData.slice(0, 5), {
				link: `<http://json-server-mocker-masai.herokuapp.com/tasks?_page=1&_limit=5>; rel="first", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=2&_limit=5>; rel="next", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=2&_limit=5>; rel="last"`
			})
		const { getByTestId, findAllByTestId, findByText } = render(<App />)

		let elems = await findAllByTestId(testIds.listTodo)
		expect(elems.length).toBe(5)
		expect(elems[0]).toHaveTextContent(todoData[0].title)

		const firstButton = getByTestId(testIds.firstButton)
		const lastButton = getByTestId(testIds.lastButton)
		const prevButton = getByTestId(testIds.prevButton)
		const nextButton = getByTestId(testIds.nextButton)
		const currentButton = getByTestId(testIds.currentButton)

		act(() => {
			const secondPageResults = todoData.slice(5, 10)
			mocker
				.onGet('https://json-server-mocker-masai.herokuapp.com/tasks', {
					params: {
						_page: '2',
						_limit: '5'
					}
				})
				.reply(200, secondPageResults, {
					link: `<http://json-server-mocker-masai.herokuapp.com/tasks?_page=1&_limit=5>; rel="first", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=1&_limit=5>; rel="prev", <http://json-server-mocker-masai.herokuapp.com/tasks?_page=2&_limit=5>; rel="last"`
				})
			fireEvent.click(nextButton)
		})
		elems = await findAllByTestId(testIds.listTodo)
		expect(mocker.history.get.length).toBe(2)
		expect(elems.length).toBe(5)
		elems = await findAllByTestId(testIds.listTodo)
		const title = elems[0].querySelector(`[data-testid="${testIds.itemTitle}"]`)
		expect(title).toHaveTextContent(todoData[5].title)
	})
})
