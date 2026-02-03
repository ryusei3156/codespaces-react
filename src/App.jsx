import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [deadline, setDeadline] = useState("");

  // 【追加】ブラウザ読み込み時にデータを取得 (ver.1.1)
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos)); // 文字列を配列に戻してセット
    }
  }, []); // 最初の一度だけ実行

  // 【追加】todosの状態が変化するたびにデータを保存 (ver.1.1)
  useEffect(() => {
    // todosが空でないときだけ保存するようにガードをかける
    if (todos.length > 0) {  // ver.1.1.1
      localStorage.setItem("todos", JSON.stringify(todos)); // 配列を文字列に変換して保存
    }
  }, [todos]); // todosが更新されるたびに実行

  // タスクを追加する関数
  const addTodo = () => {
    if (inputValue === "") return;
    const date = new Date()
    const dateString = date.toLocaleDateString('ja-JP')
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      day: dateString,
      deadline
    };
    setTodos([...todos, newTodo]);
    setInputValue("");
    setDeadline("");
  };

  // 完了状態を切り替える関数
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // タスクを削除する関数
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ToDo App (ver.1.2.0)</h1>
        <div className="input-area">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="タスクを入力"
          />
          <input type="date" 
          value={deadline} 
          onChange={(e) => setDeadline(e.target.value)} 
          /> {/*期限*/}
          <button onClick={addTodo} className="add-button">
            追加
          </button>
          {/*
          <p>入力中: {inputValue}</p>
          */}
        </div>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-wrapper">
              <div className="todo-task">
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => toggleTodo(todo.id)} 
                  className="todo-checkbox"
                />
                <span className={todo.completed ? "todo-text completed" : "todo-text"}>
                  {todo.text}
                </span>
              <div className='todo-addDay'>
                {todo.day}
              </div>
              <div className='todo-addDay'>
                {todo.deadline}
              </div>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="delete-button">
                削除
              </button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;