"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChatStore } from "@/lib/chat-store"
import { cn } from "@/lib/utils"
import { SquarePenIcon, Trash2Icon, PinIcon, PinOffIcon, MoreHorizontalIcon, MessageSquareTextIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export function ChatSidebar() {
  const { chats, currentChatId, createChat, deleteChat, pinChat, setCurrentChat, renameChat } = useChatStore()
  const router = useRouter()

  const sorted = [...chats].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.updatedAt - a.updatedAt
  })

  function handleNewChat() {
    const id = createChat()
    router.push("/chat")
  }

  function handleSelectChat(id: string) {
    setCurrentChat(id)
    router.push("/chat")
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New Chat"
              onClick={handleNewChat}
            >
              <SquarePenIcon />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sorted.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    isActive={chat.id === currentChatId}
                    onClick={() => handleSelectChat(chat.id)}
                    tooltip={chat.title}
                  >
                    <MessageSquareTextIcon />
                    <span className="truncate">{chat.title}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <SidebarMenuAction
                        showOnHover
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <MoreHorizontalIcon />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem onClick={() => pinChat(chat.id)}>
                        {chat.pinned ? <PinOffIcon /> : <PinIcon />}
                        {chat.pinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          deleteChat(chat.id)
                          if (chat.id === currentChatId) {
                            router.push("/")
                          }
                        }}
                      >
                        <Trash2Icon />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-muted-foreground">
          {chats.length} chat{chats.length !== 1 ? "s" : ""}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
