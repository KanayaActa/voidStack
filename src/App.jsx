import { useState, useEffect } from 'react'
import './App.css'

// ローカルストレージのキー
const STORAGE_KEY = 'void_stack_tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isBooting, setIsBooting] = useState(true)
  const [bootMessages, setBootMessages] = useState([])

  // ローカルストレージからタスクを読み込み（起動シーケンスより前に実行）
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY)
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        setTasks(parsedTasks)
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error)
      }
    }
  }, [])

  // タスクが変更されたらローカルストレージに保存（初期化時は除く）
  useEffect(() => {
    // 初期化時の空配列保存を防ぐため、少し遅延させる
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }, 100)
    
    return () => clearTimeout(timer)
  }, [tasks])

  // 起動シーケンス
  useEffect(() => {
    const messages = [
      'VOID_STACK v1.0 INITIALIZING...',
      'LOADING TASK MANAGEMENT PROTOCOL...',
      'LIFO STACK SYSTEM READY',
      'WELCOME TO THE VOID'
    ]

    let messageIndex = 0
    const interval = setInterval(() => {
      if (messageIndex < messages.length) {
        setBootMessages(prev => [...prev, messages[messageIndex]])
        messageIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => setIsBooting(false), 1000)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  // タスクを追加（Push）
  const pushTask = () => {
    if (inputValue.trim()) {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        timestamp: new Date().toLocaleTimeString()
      }
      setTasks(prev => [newTask, ...prev])
      setInputValue('')
    }
  }

  // タスクを削除（Pop）
  const popTask = () => {
    if (tasks.length > 0) {
      setTasks(prev => prev.slice(1))
    }
  }

  // キーボードイベント
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && e.target.matches('input')) {
        // 入力フィールドでEnterが押された場合は、pushTask()を呼ぶ
        return
      } else if (e.key === ' ' && !e.target.matches('input')) {
        e.preventDefault()
        setTasks(prev => prev.length > 0 ? prev.slice(1) : prev)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (isBooting) {
    return (
      <div className="crt-screen flex items-center justify-center">
        <div className="text-center">
          {bootMessages.map((message, index) => (
            <div 
              key={index} 
              className="retro-font-small glow-effect mb-4 text-sm"
            >
              {message}
            </div>
          ))}
          <div className="retro-font glow-accent text-2xl mt-8">
            VOID_STACK
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="crt-screen min-h-screen flex flex-col items-center justify-center p-8">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="retro-font glow-accent text-3xl mb-4">VOID_STACK</h1>
        <p className="retro-font-small glow-effect text-sm">
          LIFO TASK MANAGEMENT SYSTEM
        </p>
      </div>

      {/* メインスタック表示エリア */}
      <div className="relative mb-12">
        {tasks.length === 0 ? (
          <div className="task-card p-8 rounded-lg text-center min-w-[400px]">
            <div className="retro-font-small text-lg mb-2">STACK EMPTY</div>
            <div className="retro-font-small text-sm opacity-70">
              ADD A TASK TO BEGIN
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* 現在のタスク（一番上） */}
            <div className="task-card p-6 rounded-lg min-w-[400px] card-slide-in relative z-10">
              <div className="retro-font-small text-lg mb-2">
                {tasks[0].text}
              </div>
              <div className="retro-font-small text-xs opacity-50">
                ADDED: {tasks[0].timestamp}
              </div>
            </div>

            {/* スタックの影（奥行き表現） */}
            {tasks.slice(1, 4).map((_, index) => (
              <div
                key={index}
                className="absolute top-0 left-0 w-full h-full task-card rounded-lg opacity-30"
                style={{
                  transform: `translateY(${(index + 1) * 4}px) translateX(${(index + 1) * 2}px)`,
                  zIndex: 9 - index
                }}
              />
            ))}
          </div>
        )}

        {/* スタック情報 */}
        <div className="text-center mt-6">
          <div className="retro-font-small text-sm glow-effect">
            STACK SIZE: {tasks.length}
          </div>
        </div>
      </div>

      {/* 入力エリア */}
      <div className="w-full max-w-md">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              pushTask()
            }
          }}
          placeholder="ENTER NEW TASK..."
          className="void-input w-full p-4 rounded-lg text-center placeholder-gray-500"
        />
        <div className="text-center mt-4">
          <div className="retro-font-small text-xs glow-effect">
            ENTER: PUSH | SPACE: POP
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="absolute bottom-4 text-center">
        <div className="retro-font-small text-xs opacity-50">
          VOID_STACK v1.0 | CYBERPUNK TERMINAL MODE
        </div>
      </div>
    </div>
  )
}

export default App

