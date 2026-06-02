import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { User, Mail, Briefcase, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const femaleAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150"
];

const maleAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150"
];

export const RegistrationView: React.FC = () => {
  const { setProfile, showToast } = useGame();
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Hombre' | 'Mujer' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gender) {
      showToast('Por favor selecciona tu género para asignarte una foto de perfil adecuada.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Pick avatar according to gender/sex
    const avatarList = gender === 'Mujer' ? femaleAvatars : maleAvatars;
    // Choose a random one
    const randomIndex = Math.floor(Math.random() * avatarList.length);
    const chosenAvatar = avatarList[randomIndex];

    setTimeout(() => {
      setProfile({
        name: name.trim(),
        role: role,
        email: email.trim().toLowerCase(),
        avatar: chosenAvatar,
        gender: gender,
        isRegistered: true
      });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast(`¡Bienvenido/a, ${name}! Tu perfil ha sido creado exitosamente. 🎉`, 'success');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-6 py-6 px-1 animate-fade-in select-none max-w-md mx-auto">
      {/* Onboarding Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-brand to-purple-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-lg animate-bounce">
          <Sparkles className="w-8 h-8 fill-indigo-200" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Registro de Auditor/a</h2>
        <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
          Ingresa tus datos para comenzar tu aventura en la gamificación de auditorías contables.
        </p>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-ambient border border-gray-100 space-y-4">
        {/* Input Name */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
            Nombre Completo
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Ej: Sofía Rodriguez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-250 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Input Email */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              placeholder="Ej: sofia@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-255 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Cargo Input text box */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
            Cargo / Rol Contable
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Ej: Analista Contable Senior"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-255 rounded-xl pl-10 pr-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Gender / Sex selector with avatars logic */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
            Género (Para asignar tu foto perfil)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender('Mujer')}
              className={`py-3 px-4 rounded-xl border font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                gender === 'Mujer'
                  ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm'
                  : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">👩</span>
              <span>Mujer</span>
              {gender === 'Mujer' && <Check className="w-3.5 h-3.5 text-purple-600 stroke-[3]" />}
            </button>

            <button
              type="button"
              onClick={() => setGender('Hombre')}
              className={`py-3 px-4 rounded-xl border font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                gender === 'Hombre'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                  : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">👨</span>
              <span>Hombre</span>
              {gender === 'Hombre' && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-indigo-brand hover:bg-indigo-brand-hover text-white font-black text-xs rounded-xl shadow-lift hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 pt-3.5 pb-3.5 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Creando perfil...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-indigo-200 fill-white" />
              <span>Comenzar Auditoría 🚀</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
