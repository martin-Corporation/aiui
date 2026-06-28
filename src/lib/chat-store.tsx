"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import type { UIMessage } from "ai"

export interface Chat {
  id: string
  title: string
  messages: UIMessage[]
  pinned: boolean
  createdAt: number
  updatedAt: number
}

export interface Settings {
  nickname: string
}

interface ChatStore {
  chats: Chat[]
  currentChatId: string | null
  settings: Settings
  createChat: () => string
  deleteChat: (id: string) => void
  pinChat: (id: string) => void
  setCurrentChat: (id: string | null) => void
  updateChatMessages: (id: string, messages: UIMessage[]) => void
  updateSettings: (settings: Partial<Settings>) => void
  renameChat: (id: string, title: string) => void
}

const defaultSettings: Settings = { nickname: "You" }

function isBrowser() {
  return typeof window !== "undefined"
}

function loadChats(): Chat[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem("aiui-chats")
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadCurrentChatId(): string | null {
  if (!isBrowser()) return null
  return localStorage.getItem("aiui-current-chat-id") ?? null
}

function loadSettings(): Settings {
  if (!isBrowser()) return defaultSettings
  try {
    const raw = localStorage.getItem("aiui-settings")
    return raw ? JSON.parse(raw) : defaultSettings
  } catch {
    return defaultSettings
  }
}

function saveChats(chats: Chat[]) {
  localStorage.setItem("aiui-chats", JSON.stringify(chats))
}

function saveCurrentChatId(id: string | null) {
  if (id) {
    localStorage.setItem("aiui-current-chat-id", id)
  } else {
    localStorage.removeItem("aiui-current-chat-id")
  }
}

function saveSettings(settings: Settings) {
  localStorage.setItem("aiui-settings", JSON.stringify(settings))
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const ChatStoreContext = createContext<ChatStore | null>(null)

export function ChatStoreProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(loadChats)
  const [currentChatId, setCurrentChatIdState] = useState<string | null>(loadCurrentChatId)
  const [settings, setSettingsState] = useState<Settings>(loadSettings)
  const chatsRef = useRef(chats)
  chatsRef.current = chats

  const persistChats = useCallback((newChats: Chat[]) => {
    setChats(newChats)
    saveChats(newChats)
  }, [])

  const setCurrentChat = useCallback((id: string | null) => {
    setCurrentChatIdState(id)
    saveCurrentChatId(id)
  }, [])

  const createChat = useCallback(() => {
    const id = generateId()
    const now = Date.now()
    const newChat: Chat = {
      id,
      title: "New Chat",
      messages: [],
      pinned: false,
      createdAt: now,
      updatedAt: now,
    }
    persistChats([...chatsRef.current, newChat])
    setCurrentChat(id)
    return id
  }, [persistChats, setCurrentChat])

  const deleteChat = useCallback((id: string) => {
    const newChats = chatsRef.current.filter((c) => c.id !== id)
    persistChats(newChats)
    if (currentChatId === id) {
      setCurrentChat(null)
    }
  }, [persistChats, setCurrentChat, currentChatId])

  const pinChat = useCallback((id: string) => {
    const newChats = chatsRef.current.map((c) =>
      c.id === id ? { ...c, pinned: !c.pinned } : c
    )
    persistChats(newChats)
  }, [persistChats])

  const updateChatMessages = useCallback((id: string, messages: UIMessage[]) => {
    const newChats = chatsRef.current.map((c) =>
      c.id === id ? { ...c, messages, updatedAt: Date.now() } : c
    )
    persistChats(newChats)
  }, [persistChats])

  const renameChat = useCallback((id: string, title: string) => {
    const newChats = chatsRef.current.map((c) =>
      c.id === id ? { ...c, title, updatedAt: Date.now() } : c
    )
    persistChats(newChats)
  }, [persistChats])

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...partial }
      saveSettings(next)
      return next
    })
  }, [])

  const currentChat = currentChatId ? chats.find((c) => c.id === currentChatId) ?? null : null

  const value = useMemo<ChatStore>(
    () => ({
      chats,
      currentChatId,
      settings,
      createChat,
      deleteChat,
      pinChat,
      setCurrentChat,
      updateChatMessages,
      updateSettings,
      renameChat,
    }),
    [chats, currentChatId, settings, createChat, deleteChat, pinChat, setCurrentChat, updateChatMessages, updateSettings, renameChat],
  )

  return <ChatStoreContext.Provider value={value}>{children}</ChatStoreContext.Provider>
}

export function useChatStore() {
  const ctx = useContext(ChatStoreContext)
  if (!ctx) throw new Error("useChatStore must be used within a ChatStoreProvider")
  return ctx
}
