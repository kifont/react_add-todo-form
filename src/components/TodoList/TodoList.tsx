import React from 'react';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../App';
import users from '../../api/users';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={{ ...todo, user: users.find(user => user.id === todo.userId) }}
        />
      ))}
    </section>
  );
};
