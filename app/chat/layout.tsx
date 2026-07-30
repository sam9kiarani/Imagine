import { ChatShell } from "../../components/ui/chat-shell";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ChatShell>{children}</ChatShell>;
}
