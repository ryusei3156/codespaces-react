import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputTask, setInputTask] = useState("");
  const [inputDeadline, setInputDeadline] = useState("");

  // ブラウザ読み込み時にデータを取得
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos)); // 文字列を配列に戻してセット
    }
  }, []); // 最初の一度だけ実行

  // todosの状態が変化するたびにデータを保存
  useEffect(() => {
    // todosが空でないときだけ保存するようにガードをかける
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos)); // 配列を文字列に変換して保存
    }
  }, [todos]); // todosが更新されるたびに実行

  // タスクを追加する関数
  const addTodo = () => {
    if (inputTask === "") return;
    const addMs = Date.now();
    /* const date = new Date()
    const dateString = date.toLocaleDateString('ja-JP')
    // ハイフン(-)をスラッシュ(/)に書き換える（2026-02-26 -> 2026/02/26）*/
    const formattedDeadline = inputDeadline
      ? inputDeadline.replace(/-/g, '/')
      : "ー";

    const newTodo = {
      id: addMs,
      text: inputTask,
      statusNum: 0,
      day: new Date(addMs).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      deadline: formattedDeadline
    };
    setTodos([...todos, newTodo]);
    setInputTask("");
    setInputDeadline("");
  };

  // 状態を切り替える関数
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, statusNum: todo.statusNum + 1} : todo
        /*todo.id === id ? { ...todo, completed: !todo.completed } : todo */
      )
    );
  };

  // タスクを削除する関数
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // タスクの並び替え
  const calculateD = (todo) => {
    if (todo.deadline === "ー") return 1; // 期限なしは余裕度d=1とみなす
    const a = todo.id; // タスク作成時の時間（ms）
    const b = Date.parse(todo.deadline); // 期限の時間（ms）
    const c = Date.now(); // 今（Appを操作しているとき）の時間（ms）
    return (b - c) / (b - a); //余裕度d
  };

  const sortedTodos = [...todos].sort((taskX, taskY) => {
    const isCompletedX = taskX.statusNum % 3 === 2;
    const isCompletedY = taskY.statusNum % 3 === 2;

    // タスクが「完了」かどうかで判定
    if (isCompletedX !== isCompletedY) {
      // 片方だけ完了している場合：taskXがtrue（完了）なら後ろ(1)にする
      return isCompletedX ? 1 : -1;
    } else {

      const b_X = taskX.deadline === "ー" ? Infinity : Date.parse(taskX.deadline);
      const b_Y = taskY.deadline === "ー" ? Infinity : Date.parse(taskY.deadline);

      if (b_X !== b_Y) {
        // 期限が違う場合は、ここで終了
        return b_X - b_Y;
      } else {
        // 期限が同じ場合は、余裕度で並び替え
        const d_X = calculateD(taskX);
        const d_Y = calculateD(taskY);
        return d_X - d_Y;
      }
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>ToDo App (ver.1.5.2)</h1>
        <div className="input-area">
          <input 
            type="text" 
            value={inputTask} 
            onChange={(e) => setInputTask(e.target.value)} 
            placeholder="タスクを入力"
          />
          <input 
          type="date" 
          value={inputDeadline} 
          onChange={(e) => setInputDeadline(e.target.value)} 
          /> {/*期限*/}
          <button onClick={addTodo} className="add-button">
            追加
          </button>
          {/*
          <p>入力中: {inputTask}</p>
          */}
        </div>
        <div className="todo-labels">
          <span className="label-task">タスク</span>
          <span className="label-addDate">追加日</span>
          <span className="label-deadline">期限</span>
          <span className="label-delete"></span>
        </div>
        <ul className="todo-list">
          {sortedTodos.map((todo) => {
            const statusLabels = ["未着手", "進行中", "完了"];
            const currentStatus = statusLabels[todo.statusNum % 3];

            const d = calculateD(todo); //余裕度d
            let progressClass = ""; // 色を変えるためのクラス名を入れる箱
            if (todo.deadline !== "ー") {
              if (d <= 0.2) {
                progressClass = "warning-red";    // 残り20%以下
              } else if (d <= 0.5) {
                progressClass = "warning-yellow"; // 残り50%以下
              }
            }

            return (
            <li key={todo.id} className="todo-wrapper">
              <div className="todo-main">
                <button onClick={() =>toggleTodo(todo.id)} className={`status-button status-${todo.statusNum % 3}`}>
                  {currentStatus}
                </button>
                {/* <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => toggleTodo(todo.id)} 
                  className="todo-checkbox"
                />
                チェックボックス */}
                <span className={`todo-text ${todo.statusNum % 3 === 2 ? "completed" : ""} ${progressClass}`}>
                  {todo.text}
                </span>
              </div>
              <div className="todo-date">{todo.day}</div>
              <div className="todo-date">{todo.deadline}</div>
              <button onClick={() => deleteTodo(todo.id)} className="delete-button">
                削除
              </button>
            </li>
            );
          })}
        </ul>
      </header>
    </div>
  );
}

export default App;