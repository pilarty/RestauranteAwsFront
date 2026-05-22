import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="bg-[#FCFBF8] text-[#4A3B32] min-h-screen font-sans selection:bg-[#D4AF37]/30">
      <RouterProvider router={router} />
      <Toaster theme="light" richColors position="top-right" />
    </div>
  );
}
