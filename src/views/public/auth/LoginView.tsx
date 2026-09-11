import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArcadeCard,
  ArcadeButton,
  ArcadeInput,
  ArcadeCheckbox,
  ArcadeTabs,
  ArcadeBadge,
  ArcadeModal,
  Callout,
  gem1Url as gem1,
  gem2Url as gem2,
  gem3Url as gem3,
  gem4Url as gem4,
  steveUrl as steveImg,
} from 'tup-arcade-ui';
import { User, GraduationCap, ShieldCheck, KeyRound, UserPlus } from 'lucide-react';

export type UserRole = 'student' | 'teacher' | 'admin';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/my-courses');
  };

  const roleConfig = {
    student: {
      label: 'Alumno',
      icon: <User className="w-4 h-4" />,
      accent: 'text-brand-2',
      tag: 'LVL 1 JUGADOR',
      desc: 'Acceso a misiones, ranking y marketplace de canje.'
    },
    teacher: {
      label: 'Profesor',
      icon: <GraduationCap className="w-4 h-4" />,
      accent: 'text-gold',
      tag: 'MASTER / GUILD',
      desc: 'Gestión de desafíos, auditoría de IA y calificaciones.'
    },
    admin: {
      label: 'Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      accent: 'text-brand',
      tag: 'ROOT ACCESS',
      desc: 'Gobernanza de IA, logs y métricas globales.'
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 relative overflow-hidden bg-canvas font-mono">
      {/* Scanline CRT overlay */}
      <div className="crt-overlay absolute inset-0 z-50 pointer-events-none" />

      <div className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Formulario (Columna Izquierda) */}
        <ArcadeCard variant="cyan" className="lg:col-span-6 flex flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-['Press_Start_2P',monospace] text-base sm:text-lg text-brand-2 tracking-wider">
                Bienvenida
              </h1>
              <span className="text-[9px] font-['Press_Start_2P',monospace] text-brand-2 border border-brand-2/40 bg-brand-2/40 px-1.5 py-0.5 rounded">
                INSERT COIN
              </span>
            </div>

            {/* Selector de Rol */}
            <div className="mb-4">
              <label className="block font-['Press_Start_2P',monospace] text-[10px] text-ink-soft mb-1.5">
                Seleccioná tu Rol
              </label>
              <ArcadeTabs
                tabs={(['student', 'teacher', 'admin'] as UserRole[]).map((r) => ({
                  id: r,
                  label: roleConfig[r].label,
                  icon: roleConfig[r].icon,
                }))}
                activeId={role}
                onChange={(id) => setRole(id as UserRole)}
              />
              <div className="mt-2 flex flex-col gap-1">
                <ArcadeBadge tone="cyan" appearance="outline" size="sm">
                  {roleConfig[role].tag}
                </ArcadeBadge>
                <p className="text-[11px] text-ink-soft">{roleConfig[role].desc}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <ArcadeInput
                id="username"
                label={role === 'student' ? 'Usuario o Legajo' : 'Correo Institucional / Usuario'}
                placeholder={role === 'student' ? 'Ej: 412349 o gamer_tag' : 'docente@frt.utn.edu.ar'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <ArcadeInput
                id="password"
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Recordarme y Olvidó contraseña */}
              <div className="flex items-center justify-between text-[11px] text-ink-soft pt-0.5">
                <ArcadeCheckbox
                  label="Recordarme"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                <button
                  type="button"
                  onClick={() => setRecoveryOpen(true)}
                  className="text-ink-soft hover:text-brand-2 flex items-center gap-1 underline transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>¿Olvidaste tu contraseña?</span>
                </button>
              </div>

              {/* Botón principal */}
              <div className="pt-2 flex flex-col gap-2.5 items-center">
                <ArcadeButton type="submit" variant="magenta" size="sm" className="w-full">
                  Iniciar sesión
                </ArcadeButton>

                {/* Acceso a registro / primer ingreso */}
                <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                  <span>¿Aún no tenés cuenta?</span>
                  <button
                    type="button"
                    onClick={() => setRegisterOpen(true)}
                    className="text-brand-2 hover:text-brand-2 font-bold underline flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Registrate acá</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-5 pt-3 border-t border-surface-2 text-center text-[10px] text-ink-soft">
            PLATAFORMA GAMIFICADA TUP • 2026 EDITION
          </div>
        </ArcadeCard>

        {/* Ilustración (Columna Derecha): Steve + gemas, sin marco */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center gap-4 text-center relative">
          <div className="relative w-full h-72 sm:h-[26rem] flex items-center justify-center">
            <img
              src={gem1}
              alt=""
              className="absolute top-10 sm:top-16 left-10 sm:left-20 w-8 sm:w-11 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              style={{ animation: 'float 2.6s ease-in-out infinite', animationDelay: '0.2s' }}
            />
            <img
              src={gem2}
              alt=""
              className="absolute top-12 sm:top-20 right-8 sm:right-16 w-6 sm:w-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              style={{ animation: 'float 3.4s ease-in-out infinite', animationDelay: '0.6s' }}
            />
            <img
              src={gem3}
              alt=""
              className="absolute bottom-14 sm:bottom-24 left-8 sm:left-16 w-5 sm:w-7 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              style={{ animation: 'float 2.9s ease-in-out infinite', animationDelay: '1s' }}
            />
            <img
              src={gem4}
              alt=""
              className="absolute bottom-8 sm:bottom-14 right-10 sm:right-20 w-9 sm:w-12 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              style={{ animation: 'float 3.1s ease-in-out infinite', animationDelay: '0.4s' }}
            />

            {/* Reutilizadas en posiciones no espejadas, para romper la simetría */}
            <img
              src={gem2}
              alt=""
              className="absolute top-[42%] left-4 sm:left-10 w-5 sm:w-7 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              style={{ animation: 'float 2.5s ease-in-out infinite', animationDelay: '0.9s' }}
            />
            <img
              src={gem4}
              alt=""
              className="absolute top-[42%] right-2 sm:right-6 w-6 sm:w-9 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              style={{ animation: 'float 3.2s ease-in-out infinite', animationDelay: '1.3s' }}
            />

            <img
              src={steveImg}
              alt="Steve"
              className="relative z-10 w-[252px] sm:w-[324px] drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)]"
              style={{ animation: 'float 3.6s ease-in-out infinite' }}
            />
          </div>

          <p className="text-brand-2 text-xs tracking-wider uppercase">
            Tecnicatura Universitaria en Programación
          </p>
        </div>
      </div>

      <ArcadeModal
        open={recoveryOpen}
        onClose={() => {
          setRecoveryOpen(false);
          setRecoverySent(false);
        }}
        title="Recuperar contraseña"
        subtitle="Te enviamos un enlace de restablecimiento a tu correo institucional."
        tone="cyan"
        size="sm"
        footer={
          !recoverySent && (
            <ArcadeButton
              variant="cyan"
              size="sm"
              disabled={recoveryEmail.trim() === ''}
              onClick={() => setRecoverySent(true)}
            >
              Enviar enlace
            </ArcadeButton>
          )
        }
      >
        {recoverySent ? (
          <Callout variant="tip" title="Enlace enviado">
            Revisá la bandeja de {recoveryEmail}. El enlace vence en 30 minutos.
          </Callout>
        ) : (
          <ArcadeInput
            label="Correo institucional"
            type="email"
            placeholder="usuario@frt.utn.edu.ar"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
        )}
      </ArcadeModal>

      <ArcadeModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        title="Registro institucional"
        tone="magenta"
        size="sm"
        footer={
          <ArcadeButton variant="magenta" size="sm" onClick={() => setRegisterOpen(false)}>
            Entendido
          </ArcadeButton>
        }
      >
        <Callout variant="note" title="Alta de cuenta">
          Las cuentas se crean desde el sistema académico de la facultad. Si ya sos alumno o
          docente, tu legajo habilita el acceso sin registro previo.
        </Callout>
      </ArcadeModal>
    </div>
  );
};
