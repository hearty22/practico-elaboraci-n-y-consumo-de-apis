import { login } from "../api/api";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";
import { useState } from "react";
import { InfoModal } from "../components/InfoModal";

export const LoginPage = () => {
  const { isLoading, setIsLoading, checkAuthStatus } = useAuth();
  const { formData, handleChange } = useForm({
    email: "",
    password: "",
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action?: { text: string; to: string };
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login({
        email: formData.email,
        password: formData.password,
      });
      console.log(data);
      if (data.ok) {
        await checkAuthStatus();
        setModalState({
          isOpen: true,
          title: "¡Éxito!",
          message: `Bienvenido de nuevo, ${data.data.user.username}.`,
          action: { text: "Ir a mis tareas", to: "/tasks" },
        });
      } else {
        setModalState({
          isOpen: true,
          title: "Error de inicio de sesión",
          message:
            data.message || data.msg || "Las credenciales son incorrectas.",
        });
      }
    } catch (error) {
      let errorMessage =
        "No se pudo conectar con el servidor. Inténtalo de nuevo.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setModalState({
        isOpen: true,
        title: "Error de conexión",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", message: "" });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <InfoModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        action={modalState.action}
      />
      <div className="min-h-screen flex items-center justify-center bg-[#080C14] relative overflow-hidden">
        <div className="fixed w-[500px] h-[500px] -top-36 -left-24 rounded-full bg-[#3D5AFE]/10 blur-[80px] pointer-events-none" />
        <div className="fixed w-[400px] h-[400px] -bottom-28 -right-20 rounded-full bg-[#7C3AED]/10 blur-[80px] pointer-events-none" />

        {/* Card glassmorphism */}
        <div className="relative w-full max-w-sm mx-4 px-10 py-11 bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
          {/* Shimmer top */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3D5AFE]/15 border border-[#3D5AFE]/30 rounded-full text-[11px] font-medium tracking-widest uppercase text-indigo-400 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3D5AFE] shadow-[0_0_8px_#3D5AFE] animate-pulse" />
            Acceso seguro
          </div>

          <h2 className="font-bold text-3xl text-slate-100 leading-tight mb-8">
            Bienvenido
            <br />
            de{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              vuelta
            </span>
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium tracking-widest uppercase text-slate-500">
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-slate-200 placeholder-slate-700 text-sm outline-none focus:bg-white/[0.07] focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium tracking-widest uppercase text-slate-500">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-slate-200 placeholder-slate-700 text-sm outline-none focus:bg-white/[0.07] focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full py-3.5 bg-gradient-to-br from-[#3D5AFE] to-[#7C3AED] text-white font-semibold text-sm rounded-lg shadow-[0_4px_20px_rgba(61,90,254,0.3)] hover:shadow-[0_8px_30px_rgba(61,90,254,0.4)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Ingresar →
            </button>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-slate-600">
                ¿primera vez por acá?
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-500 mb-1.5">
                No estás loggeado aún.
              </p>
              <a
                href="/register"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Registrate aquí
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
