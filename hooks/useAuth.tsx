import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

import { useRouter } from 'next/router'
import { Children, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'
import cookieCutter from 'cookie-cutter'
import requests from '../utils/requests'
import { User } from '../typings'

interface IAuth {
  user: User | null
  token: string | null
  signUp: (user: any) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  loading: boolean
}

const AuthContext = createContext<IAuth>({
  user: null,
  token: null,
  signUp: async () => { },
  signIn: async () => { },
  logout: async () => { },
  error: null,
  loading: false,
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const cookieToken = cookieCutter.get('token');

    if (cookieToken) {
      fetch(requests.fetchCheckToken, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookieToken}`,
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setUser(data)
            setLoading(false)
            setToken(cookieToken);
          } else {
            setUser(null)
            setLoading(false)
            router.push('/login')
          }
        })
        .catch(err => { console.log(err) })
    } else {
      setUser(null)
      setLoading(false)
      router.push('/login')
    }

    setInitialLoading(false)
  }, [])

  const signUp = async (user: any) => {
    setLoading(true)
    const newUser = await fetch(requests.fetchSignUp, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })

    if (newUser.ok) {
      await signIn(user.email, user.password)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const req = await fetch(requests.fetchLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password })
    })
    if (req.ok) {
      const userResponse = await req.json()
      setUser(userResponse)
      cookieCutter.set('token', userResponse.token)
      router.push('/')
      setLoading(false)
      setInitialLoading(false)
    }else {
      const userResponse = await req.json()
      setError(userResponse)
    }
  }

  const logout = async () => {
    setLoading(true)
    cookieCutter.set('token', '', { expires: new Date(0) })
    setUser(null)
    router.push('/login')
  }

  const memoedValue = useMemo(
    () => ({ user, token, signUp, signIn, error, loading, logout }),
    [user, token, loading, error]
  )

  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
    </AuthContext.Provider>)
}

export default function useAuth() {
  return useContext(AuthContext)
}