import React from 'react';
import ReactDOM from 'react-dom';
import Todos from './Todos';
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux';

let storeTransitionsObjectsArray = [], undoCounter = 0, currentTransitionIndex = -1, pushInstoreTransitionsObjectsArray = false;

const todoAddToggle = (state = [], action) => {
  // console.log(state, action);
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { id: state.length, text: action.text, completed: action.completed = false }];
    case "TOGGLE_TODO":
      return [...state.slice(0, action.id), { id: state[action.id].id, text: state[action.id].text, completed: !state[action.id].completed }, ...state.slice(action.id + 1)]
    default:
      return state;
  }
}

const todoVisibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
}

const todoUndoRedo = (state = {}, action) => {
  switch (action.type) {
    case "UNDO":
      undoCounter++;
      pushInstoreTransitionsObjectsArray = false;
      return { ...storeTransitionsObjectsArray[action.index] };
    case "REDO":
      undoCounter--;
      pushInstoreTransitionsObjectsArray = false;
      return { ...storeTransitionsObjectsArray[action.index] };
    default:
      pushInstoreTransitionsObjectsArray = true;
      return todoCombinedReducer(state, action);
  }
}

const todoCombinedReducer = (state = {}, action) => {
  return {
    todos: todoAddToggle(state.todos, action),
    todoVisibilityFilter: todoVisibilityFilter(state.todoVisibilityFilter, action)
  }
}

const store = createStore(todoUndoRedo);

const render = () => {
  console.log(store.getState());

  if (pushInstoreTransitionsObjectsArray) {
    currentTransitionIndex++;
    storeTransitionsObjectsArray = storeTransitionsObjectsArray.concat(store.getState());
  }

  console.log(currentTransitionIndex, storeTransitionsObjectsArray);

  const props = {
    addTodo: (value) => store.dispatch({ type: "ADD_TODO", text: value }),
    storeData: store.getState(),
    toggleTodo: (value) => store.dispatch({ type: "TOGGLE_TODO", id: value }),
    setVisibilityFilter: (value) => store.dispatch({ type: "SET_VISIBILITY_FILTER", filter: value }),
    todoUndo: () => store.dispatch({ type: "UNDO", index: --currentTransitionIndex }),
    todoRedo: () => store.dispatch({ type: "REDO", index: ++currentTransitionIndex }),
    storeTransitionsObjectsArray: storeTransitionsObjectsArray,
    currentTransitionIndex: currentTransitionIndex,
    undoCounter: undoCounter

  }
  ReactDOM.render(<Todos {...props} />, document.getElementById('root'));
}

store.subscribe(render);
render();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
