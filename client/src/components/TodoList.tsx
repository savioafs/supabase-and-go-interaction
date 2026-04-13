import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Todo {
  id: string
  title: string
  is_completed: boolean
}

export const TodoList = ({ user }: { user: any }) => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) console.error('Error fetching todos:', error)
    else setTodos(data || [])
    setLoading(false)
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: newTodo, user_id: user.id }])
      .select()

    if (error) console.error('Error adding todo:', error)
    else {
      setTodos([...todos, data[0]])
      setNewTodo('')
    }
  }

  const toggleTodo = async (id: string, is_completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: !is_completed })
      .eq('id', id)

    if (error) console.error('Error updating todo:', error)
    else {
      setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !is_completed } : t))
    }
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) console.error('Error deleting todo:', error)
    else {
      setTodos(todos.filter(t => t.id !== id))
    }
  }

  if (loading) return <div className="text-center py-10">Loading tasks...</div>

  return (
    <div className="max-w-2xl w-full mx-auto mt-10">
      <form onSubmit={addTodo} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="space-y-3">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <button
                onClick={() => toggleTodo(todo.id, todo.is_completed)}
                className={`transition-colors ${todo.is_completed ? 'text-green-500' : 'text-slate-300 group-hover:text-slate-400'}`}
              >
                {todo.is_completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <span className={`flex-1 text-lg ${todo.is_completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {todo.title}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {todos.length === 0 && (
          <div className="text-center py-10 text-slate-400 bg-white border border-dashed border-slate-200 rounded-xl">
            No tasks yet. Start by adding one!
          </div>
        )}
      </div>
    </div>
  )
}
