"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Icon } from "@/helpers/icon";
export function ChatShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const history = [{ id: "1", title: "First Chat" }, { id: "2", title: "Second Chat" }]; // Placeholder for chat history

  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    if (mediaQuery.matches) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="chat-page">
      <div className="sidebar-toggle-container">
        <button
          type="button"
          className="sidebar-toggle icon-button"
          aria-label="Open chat history"
          aria-expanded={sidebarOpen}
          onClick={openSidebar}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="3" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className={`sidebar-backdrop${sidebarOpen ? " visible" : ""}`}
        aria-hidden={!sidebarOpen}
        onClick={closeSidebar}
      />

      <aside
        className={`chat-sidebar${sidebarOpen ? " open" : ""}`}
        aria-label="Chat history"
      >
        <div className="chat-sidebar-header">
          <span>Chat History</span>
          <button
            type="button"
            className="sidebar-close icon-button"
            aria-label="Close chat history"
            onClick={closeSidebar}
          >
            <Icon>
              <path d="M18 6 6 18M6 6l12 12" />
            </Icon>
          </button>
        </div>
        <Link href="/chat" className="new-chat-button" onClick={closeSidebar}>
          <Icon>
            <path d="M12 5v14M5 12h14" />
          </Icon>
          New Chat
        </Link>
        <label className="chat-search">
          <Icon>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </Icon>
          <span className="sr-only">Search chats</span>
          <input type="search" placeholder="Search chats..." />
        </label>
        <nav className="chat-history-list" aria-label="Past conversations">
          {history.length === 0 ? (
            <p className="chat-history-empty">No conversations yet.</p>
          ) : (
            history.map((chat) => {
              const href = `/chat/${chat.id}`;
              const isActive = pathname === href;

              return (
                <Link
                  key={chat.id}
                  href={href}
                  className={`chat-history-item${isActive ? " active" : ""}`}
                  onClick={closeSidebar}
                >
                  {chat.title}
                </Link>
              );
            })
          )}
        </nav>
        <button type="button" className="delete-history-button">
          <Icon>
            <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
          </Icon>
          Delete Chat History
        </button>
      </aside>

      <main className="chat-main">{children}</main>
    </div>
  );
}
