# test-sample

- Create a todo application with the following features
- The Following components are present
  - Todo.jsx
    - TodoInput.jsx
      - props: handleSubmit : function
      - use form
    - TodoList.jsx
      - props:
        data []Todos
        handleDelete : ( id: string )
        handleToggle : ( id: string, status: boolean )
    - TodoListItem.jsx
      - props:
        - title : string,
        - id : string
        - status : boolean
        - handleToggle
        - handleDelete
    - Pagination.jsx
      - props:
        - currentPage : number,
        - onChange :
        - pageLinks : parsed link
    - Spinner.jsx
- The following `features` should be present
  - on load of the component, retrieve the data from the API endpoint
  - use axios
  - A user can add a new item
  - This is the schema to be followed
    ```
      {
        "id": string, (json-server will make it),
        "title": string,
        "status": boolean
      }
    ```
  - Create a new todo item
  - make a network request to add a new item
  - Toggle status of the todo item
  - Delete status of the todo item
  - Use pagination and retrieve headers from the response headers of the API
  - When adding a new item, or toggling a task, or deleting
    - on success fetch the data again with the current page again
  - First, Prev, currentPage, Next, Last pages should be shown on the UI
  - the prev and next buttons should be disabled if not valid
