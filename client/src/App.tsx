import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { Auth } from './components/Auth'
import { TodoList } from './components/TodoList'
import { VipBadge } from './components/VipBadge'
import { LogOut, User } from 'lucide-react'

function App() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (error) console.error('Error fetching profile:', error)
    else setProfile(data)
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Auth />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <User className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{session.user.email}</h1>
            {profile?.is_vip && <VipBadge />}
          </div>
        </div>
        
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">My Tasks</h2>
          <p className="text-slate-500">Complete all tasks to unlock VIP status!</p>
        </div>
        
        <TodoList user={session.user} />
      </main>
    </div>
  )
}

export default App
