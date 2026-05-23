import restaurant1 from "../assets/Restaurante 1.jpg";
import restaurant2 from "../assets/Restaurante 2.webp";
import restaurant3 from "../assets/Restaurante 3.webp";
import restaurant4 from "../assets/Restaurante 4.webp";
import { useNavigate } from "react-router";

const branchImages = [
  restaurant1,
  restaurant2,
  restaurant3,
  restaurant4,
];

export function PaginaRestaurante() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#4A3B32] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-sm bg-[#D4AF37] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              BR
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-[#4A3B32] font-semibold">Bellavista Restaurante</h1>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <button
              onClick={() => navigate("/realizar-reserva")}
              className="rounded-sm border border-[#E8E1D5] bg-[#D4AF37] px-4 py-2 text-sm font-semibold uppercase tracking-widest text-[#4A3B32] shadow-sm transition hover:bg-[#b88e20]"
            >
              Reservas
            </button>
            <a
              href="#contacto"
              className="rounded-sm border border-[#E8E1D5] bg-white px-4 py-2 text-sm font-semibold uppercase tracking-widest text-[#4A3B32] shadow-sm transition hover:bg-[#F0EBE1]"
            >
              Contacto
            </a>
            <button
              onClick={() => navigate("/")}
              className="rounded-sm border border-[#E8E1D5] bg-[#4A3B32] px-4 py-2 text-sm font-semibold uppercase tracking-widest text-[#D4AF37] shadow-sm transition hover:bg-[#322721]"
            >
              Modo Mozo
            </button>
          </div>
        </header>

        <section id="reservas" className="mb-10 grid gap-6 md:grid-cols-2">
          {branchImages.map((src, index) => (
            <div key={index} className="group overflow-hidden rounded-none border border-transparent bg-white shadow-[0_28px_80px_rgba(74,59,50,0.12)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <img
                  src={src}
                  alt={`Sucursal ${index + 1}`}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1410]/50 via-transparent to-transparent" />
              </div>
              <div className="p-6 bg-[#FCFBF8]">
                <h3 className="text-xl font-semibold text-[#4A3B32]">Sucursal {index + 1}</h3>
                <p className="text-[#8C7A6B] mt-3 text-sm leading-6">
                  Una experiencia gastronómica vibrante con un menú pensado para grupos y cenas especiales.
                </p>
              </div>
            </div>
          ))}
        </section>

        <section id="contacto" className="rounded-sm border border-[#E8E1D5] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-serif text-[#4A3B32] mb-3">Contacto</h2>
          <div className="space-y-3 text-sm text-[#8C7A6B] leading-7">
            <p>Teléfono: <span className="text-[#4A3B32] font-semibold">+57 312 555 1234</span></p>
            <p>Dirección: Calle de la Buena Mesa 35, Ciudad</p>
            <p>Horario: Lunes a Domingo, 11:00 - 23:00</p>
            <p>Reservas en línea y atención al cliente disponible en todas las sucursales.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
