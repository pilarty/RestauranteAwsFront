import { createBrowserRouter, useRouteError } from "react-router";
import { CustomerSurvey } from "./components/CustomerSurvey";
import { Layout } from "./components/Layout";
import { PaginaRestaurante } from "./components/PaginaRestaurante";
import { Reservation } from "./components/Reservation";
import { Reservations } from "./components/Reservations";
import { Settings } from "./components/Settings";
import { TableDetails } from "./components/TableDetails";
import { TableMap } from "./components/TableMap";
import { PaginaQR } from "./components/PaginaQR";

function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FCFBF8] text-[#4A3B32] p-4 text-center">
      <h1 className="text-3xl font-serif text-[#D4AF37] mb-4">Oops! Something went wrong.</h1>
      <p className="text-[#8C7A6B] mb-6">
        {error instanceof Error ? error.message : "The requested page was not found or an error occurred."}
      </p>
      <a href="/" className="px-6 py-3 bg-[#4A3B32] text-[#D4AF37] rounded-sm font-medium uppercase tracking-widest text-xs hover:bg-[#322721] transition-colors">
        Return to Dashboard
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, Component: TableMap },
      { path: "reservations", Component: Reservations },
      { path: "table/:id", Component: TableDetails },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/realizar-reserva",
    Component: Reservation,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/pagina-restaurante",
    Component: PaginaRestaurante,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/survey/:tableId",
    Component: CustomerSurvey,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/book",
    Component: Reservation,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/pagina-qr",
    Component: PaginaQR,
    errorElement: <ErrorBoundary />,
  }
]);
