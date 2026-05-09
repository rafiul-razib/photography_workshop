import Registration from "./registration/Registration";
import ChatWidget from "./components/chatbot/ChatWidget";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.2),transparent_35%)] animate-gradient-drift" />
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl">
          <Registration />
        </div>
        <ChatWidget />
      </main>
    </div>
  );
}
