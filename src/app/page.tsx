import { Terminal } from "@/components/apps/Terminal";
import { Taskbar } from "@/components/Taskbar";

export default function Home() {
  return (
    <div>
      <Terminal />
      <Taskbar />
    </div>
  );
}
