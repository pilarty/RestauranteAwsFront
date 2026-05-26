import restaurant1 from "../assets/Restaurante 1.jpg";
import restaurant2 from "../assets/Restaurante 2.webp";
import restaurant3 from "../assets/Restaurante 3.webp";
import restaurant4 from "../assets/Restaurante 4.webp";
import heroDish from "../assets/fideos.webp";
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
    <div className="relative min-h-screen overflow-hidden bg-white text-gray-900">

      {/* Fondo global */}
      <div className="fixed inset-0 -z-10">
        <img
          src={heroDish}
          alt="Fondo"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-white/80" />
      </div>

      <div className="relative z-10">

        {/* HERO */}
        <header className="relative min-h-screen flex flex-col">

          {/* NAVBAR */}
          <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-gray-200 bg-white/80 backdrop-blur">

            <div className="flex gap-8 text-xs uppercase tracking-[0.3em] text-gray-700">
              <a href="#reservas" className="hover:text-[#D4AF37] transition">
                Sucursales
              </a>

              <a href="#contacto" className="hover:text-[#D4AF37] transition">
                Contacto
              </a>
            </div>

            {/* LOGO */}
            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37]">
                Bellavista
              </h1>

              <p className="text-[10px] tracking-[0.45em] uppercase text-gray-500 mt-2">
                Restaurante
              </p>
            </div>

            {/* BOTONES */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="border border-gray-300 px-5 py-2 text-xs uppercase tracking-[0.25em] text-gray-700 hover:bg-gray-100 transition"
              >
                Modo Mozo
              </button>
            </div>
          </nav>

          {/* CONTENIDO HERO */}
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center max-w-4xl">

              <p className="text-[#D4AF37] uppercase tracking-[0.4em] text-sm mb-6">
                Cocina Italiana Premium
              </p>

              <h2 className="text-gray-900 font-serif text-5xl md:text-7xl leading-tight">
                Elegancia y sabor en cada detalle
              </h2>

              <p className="mt-8 text-gray-600 text-lg leading-8 max-w-2xl mx-auto">
                Una propuesta gastronómica inspirada en la tradición italiana,
                combinada con una experiencia contemporánea y sofisticada.
              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-4">

                <button
                  onClick={() => navigate("/realizar-reserva")}
                  className="bg-[#D4AF37] px-8 py-4 text-sm uppercase tracking-[0.25em] text-white font-semibold hover:bg-[#bc9729] transition"
                >
                  Reservar Mesa
                </button>

                <a
                  href="#reservas"
                  className="border border-gray-300 px-8 py-4 text-sm uppercase tracking-[0.25em] text-gray-700 hover:bg-gray-100 transition"
                >
                  Ver Sucursales
                </a>

              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="px-6 md:px-12 pb-16 bg-white">

          {/* SUCURSALES */}
          <section
            id="reservas"
            className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto"
          >
            {branchImages.map((src, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 overflow-hidden shadow-sm"
              >
                <div className="overflow-hidden">
                  <img
                    src={src}
                    alt={`Sucursal ${index + 1}`}
                    className="w-full h-72 object-cover hover:scale-105 transition duration-700"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-serif text-gray-900">
                    Sucursal {index + 1}
                  </h3>

                  <p className="mt-4 text-gray-600 leading-7 text-sm">
                    Una experiencia gastronómica vibrante pensada para cenas,
                    reuniones y momentos especiales.
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* CONTACTO */}
          <section
            id="contacto"
            className="max-w-7xl mx-auto mt-16 bg-white border border-gray-200 p-10 shadow-sm"
          >
            <h2 className="text-3xl font-serif text-gray-900 mb-6">
              Contacto
            </h2>

            <div className="space-y-4 text-gray-600 leading-7">
              <p>
                Teléfono:
                <span className="text-gray-900 font-semibold ml-2">
                  +57 312 555 1234
                </span>
              </p>

              <p>Dirección: Calle de la Buena Mesa 35, Ciudad</p>

              <p>Horario: Lunes a Domingo, 11:00 - 23:00</p>

              <p>
                Reservas en línea y atención personalizada en todas las sucursales.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}