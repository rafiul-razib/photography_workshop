import Image from "next/image";
// import Login from "./components/Login";
import Form from "./components/Form";
import Registration from "./registration/Registration";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <div>
          <Registration/>
        </div>
    </main>
    </div>
  );
}
