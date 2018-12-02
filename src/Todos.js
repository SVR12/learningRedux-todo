import React, { Component } from 'react';

const TodoComponent = (todoProps) => {
  // console.log(todoProps);
  return (
    <li onClick={() => todoProps.toggleTodo(todoProps.id)} style={{ textDecoration: (todoProps.completed) ? "line-through" : "none" }}>
      {todoProps.text}
    </li>
  );
};

const getVisibleTodos = (todos, filter) => {
  // console.log(todos, filter);
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter(todo => todo.completed);
    case "SHOW_UNCOMPLETED":
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
}

class Todos extends Component {


  render() {

    console.log(this.props);
    const TodoComponents = getVisibleTodos(this.props.storeData.todos, this.props.storeData.todoVisibilityFilter).map(
      (todo, index) => {
        return <TodoComponent key={index} {...todo} toggleTodo={(index) => { this.props.toggleTodo(index) }} />
      }
    );

    // console.log(TodoComponents);

    const FilterLink = ({ filter, currentFilter, children }) => {
      if (filter === currentFilter) {
        return <span>{children}</span>;
      } else {
        return (
          <a href="#" onClick={(e) => {
            e.preventDefault();
            this.props.setVisibilityFilter(filter)
          }}
          >
            {children}
          </a>)
      }
    };



    return (
      <div className="ToDo">
        <h1>To Do</h1>
        <input type="text" ref={node => this.input = node} />
        <button onClick={
          () => {
            this.props.addTodo(this.input.value);
            this.input.value = "";
          }
        }
        >Add</button>
        <h6>{this.props.storeData.todoVisibilityFilter}</h6>
        <ul>
          {TodoComponents}
        </ul>
        <FilterLink currentFilter={this.props.storeData.todoVisibilityFilter} filter="SHOW_ALL">ALL</FilterLink>{",    "}
        <FilterLink currentFilter={this.props.storeData.todoVisibilityFilter} filter="SHOW_COMPLETED">COMPLETED</FilterLink>{",    "}
        <FilterLink currentFilter={this.props.storeData.todoVisibilityFilter} filter="SHOW_UNCOMPLETED">UNCOMPLETED</FilterLink>
        <br /><br />
        <button
          disabled={(this.props.undoCounter) ? false : true}
          onClick={() => this.props.todoRedo()}
        >REDO</button>
        <button
          disabled={
            (this.props.storeTransitionsObjectsArray.length > 1 && this.props.currentTransitionIndex > 0 &&
              this.props.currentTransitionIndex < this.props.storeTransitionsObjectsArray.length)
              ?
              false : true
          }
          onClick={() => this.props.todoUndo()}
        >
          UNDO
          </button>
      </div>
    );
  }



}

export default Todos;
