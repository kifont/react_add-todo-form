import React from 'react';
import './App.scss';
import { TodoList } from './components/TodoList';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { useState } from 'react';

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// function getNewTodoId(todos: Todo[]) {
//   const maxId = Math.max(...todos.map(todo => todo.id));

//   return maxId + 1;
// }

function getUserById(userId: number): User | null {
  return usersFromServer.find(user => user.id === userId) || null;
}

// export const initialTodos: Todo[] = todosFromServer.map(todo => ({
//   ...todo,
//   user: getUserById(todo.userId),
// }));

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>(todosFromServer);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState<string>('0');

  const [titleError, setTitleError] = useState(false);
  const [userError, setUserError] = useState(false);

  const findLargestId = () => {
    if (todos.length === 0) {
      return 1;
    }

    return Math.max(...todos.map(todo => todo.id)) + 1;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setTitleError(false);
    setUserError(false);

    let hasError = false;

    if (!title.trim()) {
      setTitleError(true);
      hasError = true;
    }

    if (userId === '0') {
      setUserError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setTodos(prev => [
      ...prev,
      {
        id: findLargestId(),
        title: title.trim(),
        completed: false,
        userId: Number(userId),
        user: getUserById(Number(userId)),
      },
    ]);

    setUserId('0');
    setTitle('');
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title__input">Title: </label>
          <input
            type="text"
            data-cy="titleInput"
            placeholder="Enter title"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setTitleError(false);
            }}
          />
          {titleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="field__select">User: </label>
          <select
            value={userId}
            onChange={e => {
              setUserId(e.target.value);
              setUserError(false);
            }}
            id="field__select"
            data-cy="userSelect"
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {userError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
