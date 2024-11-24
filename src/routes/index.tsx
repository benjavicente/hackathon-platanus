import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import icon from "@/assets/icon.png";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Hero Section */}
      <header className="max-w-screen-xl mx-auto px-4 py-20 flex flex-wrap items-center justify-between">
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
        <img src={icon} alt="quompy logo" className="h-20 -ml-4 mb-3" />

          <h1 className="text-4xl font-bold text-sky-950 mb-6">
            La Fórmula Perfecta para que tus hijos aprueben en Matemáticas
          </h1>
          <p className="text-sky-800 mb-8">
            Porque tener poco tiempo o no entender matemáticas ya no será un problema. Con quompy, <b>tú tienes el control</b> y tus hijos <i>tienen el aprendizaje</i>. 🚀🧠
          </p>
          <Link to="/onboarding" className="bg-sky-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-sky-600 transition-colors hover:cursor-pointer">
            Empieza gratis ahora <span className="ml-2 text-lg">→</span>
          </Link>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <img src={hero} alt="Students learning" className="max-w-md w-full rounded-4xl" />
        </div>
      </header>

      {/* Problem Section */}
      <section className="bg-sky-100 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center">¿Te identificas?</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="bg-sky-800 p-8 rounded-lg max-w-sm">
              <p className="text-lg">"No sé cómo ayudar a mi hijo con sus tareas de matemáticas... ¡es demasiado complicado! 😰"</p>
            </div>
            <div className="bg-sky-800 p-8 rounded-lg max-w-sm pt-10">
              <p className="text-lg">"No tengo tiempo para buscar ejercicios ni revisar cómo va su aprendizaje. 😥"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <img src={icon} alt="quompy logo" className="mx-auto h-20" />
          <h2 className="text-3xl font-bold text-sky-950 mb-12 text-center">
            Quompy simplifica todo, para que tus hijos aprendan mejor
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {[
              {
                title: "Genera Cuestionarios Automáticos",
                icon: "📋",
                description: "Solo selecciona el nivel, y Quompy crea ejercicios perfectos según las necesidades de tu hijo."
              },
              {
                title: "Adapta los Niveles de Dificultad",
                icon: "🧠",
                description: "Si un ejercicio es demasiado difícil o fácil, Quompy ajusta el desafío automáticamente."
              },
              {
                title: "Explicaciones Claras y Detalladas",
                icon: "📖",
                description: "Cada solución viene con una explicación paso a paso que incluso tú puedes entender."
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-sky-50 p-8 rounded-lg max-w-sm">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-sky-900 mb-4">{feature.title}</h3>
                <p className="text-sky-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-sky-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-sky-950 mb-8">¡Dale una ventaja a tus hijos hoy mismo!</h2>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <span className="bg-white px-4 py-2 rounded-full text-sky-800">✅ Genera ejercicios en segundos</span>
            <span className="bg-white px-4 py-2 rounded-full text-sky-800">✅ Recupera tu tiempo</span>
            <span className="bg-white px-4 py-2 rounded-full text-sky-800">✅ Paz mental garantizada</span>
          </div>
          <Link to="/onboarding" className="bg-sky-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-sky-600 transition-colors">
            Empieza gratis ahora <span className="ml-2 text-lg">→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
