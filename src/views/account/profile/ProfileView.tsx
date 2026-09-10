import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArcadeNavbar, Breadcrumb, ArcadeCard, PixelTrophy, PixelChest } from 'tup-arcade-ui';
import { Mail, MapPin, IdCard, GraduationCap, Clock, CheckCircle2, Award } from 'lucide-react';

interface PlatformActivity {
  id: string;
  course: string;
  courseAccent: 'cyan' | 'fuchsia';
  title: string;
  date: string;
  xp?: number;
  coins?: number;
}

export const ProfileView: React.FC = () => {
  const navigate = useNavigate();

  const user = {
    name: 'Tamara Alvarez',
    legajo: '412349',
    email: 'tamara.alvarez@alu.frt.utn.edu.ar',
    location: 'San Miguel de Tucumán, Argentina',
    career: 'Tecnicatura Universitaria en Programación',
    level: 12,
    levelProgress: 82,
    avatar: '👩‍💻',
  };

  const stats = [
    { label: 'XP Total', value: '9.850', icon: <span className="font-['Press_Start_2P',monospace] text-brand-2">XP</span> },
    { label: 'Monedas', value: '730', icon: <i className="nes-icon is-small coin" style={{ transform: 'scale(1.25)' }} /> },
    { label: 'Logros', value: '14', icon: <PixelTrophy className="w-4 h-4" /> },
    { label: 'Cursos Cursados', value: '2', icon: <GraduationCap className="w-4 h-4 text-success" /> },
  ];

  const activity: PlatformActivity[] = [
    { id: 'a1', course: 'Programación IV', courseAccent: 'cyan', title: 'Completó Desafío: Dockerfile Multi-stage', date: 'Hoy, 02:40 AM', xp: 200, coins: 30 },
    { id: 'a2', course: 'Programación IV', courseAccent: 'cyan', title: 'Descargó Apunte: Arquitectura y Despliegue', date: 'Ayer, 18:15', xp: 25 },
    { id: 'a3', course: 'Bases de Datos', courseAccent: 'fuchsia', title: 'Aprobó Cuestionario: Índices B-Tree y Planes de Ejecución', date: 'Hace 3 días', xp: 350, coins: 50 },
    { id: 'a4', course: 'Bases de Datos', courseAccent: 'fuchsia', title: 'Desbloqueó Logro: "SQL Optimizer Lvl 2"', date: 'Hace 4 días', xp: 100 },
    { id: 'a5', course: 'Programación IV', courseAccent: 'cyan', title: 'Ingresó a la 2da Cohorte 2026', date: 'Hace 1 semana', xp: 50 },
    { id: 'a6', course: 'Bases de Datos', courseAccent: 'fuchsia', title: 'Canjeó "Poción de Vida" en el Mercado', date: 'Hace 1 semana', coins: -150 },
    { id: 'a7', course: 'Programación IV', courseAccent: 'cyan', title: 'Boss Fight superado: Healthcheck & Reverse Proxy Nginx', date: 'Hace 2 semanas', xp: 400, coins: 60 },
    { id: 'a8', course: 'Bases de Datos', courseAccent: 'fuchsia', title: 'Ingresó a la 1ta Cohorte 2026', date: 'Hace 3 semanas', xp: 50 },
  ];

  return (
    <div className="min-h-screen w-full bg-canvas text-ink font-mono relative overflow-hidden">
      <div className="crt-overlay absolute inset-0 pointer-events-none z-50" />

      <ArcadeNavbar
        user={{ name: 'Tamara', role: 'Estudiante • Lvl 12' }}
        unreadMessages={2}
        unreadNotifications={4}
        onNavigateMessages={() => navigate('/messages')}
        onNavigateNotifications={() => navigate('/notifications')}
        onEditProfile={() => navigate('/profile')}
        onLogout={() => navigate('/login')}
      />

      <main className="w-full px-4 sm:px-8 py-8">
        <Breadcrumb items={[{ label: 'Perfil' }]} onHome={() => navigate('/my-courses')} />

        <div className="mt-4 mb-8">
          <h1 className="font-['Press_Start_2P',monospace] text-xl md:text-2xl text-brand tracking-wider">
            Mi Perfil
          </h1>
          <p className="text-sm text-ink-soft mt-1">Tus datos de cuenta y tu historial en toda la plataforma.</p>
        </div>

        {/* Datos básicos */}
        <ArcadeCard variant="default" className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 shrink-0 rounded bg-brand/15 border-2 border-brand flex items-center justify-center text-4xl">
            {user.avatar}
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-lg text-ink">{user.name}</h2>
              <span className="text-[10px] font-['Press_Start_2P',monospace] bg-brand/15 border border-brand/50 text-brand px-2 py-0.5 rounded">
                Nivel {user.level}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-ink-soft mt-1">
              <span className="flex items-center gap-2">
                <IdCard className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                Legajo: <span className="text-ink-soft">{user.legajo}</span>
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                <span className="text-ink-soft">{user.email}</span>
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                <span className="text-ink-soft">{user.location}</span>
              </span>
              <span className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                <span className="text-ink-soft">{user.career}</span>
              </span>
            </div>

            <div className="w-full max-w-xs mt-2">
              <div className="flex justify-between text-[10px] text-ink-soft mb-1">
                <span>Progreso al Nivel {user.level + 1}</span>
                <span className="text-brand">{user.levelProgress}%</span>
              </div>
              <div className="w-full h-2 bg-canvas border border-surface-2 rounded-sm p-0.5">
                <div className="h-full bg-brand rounded-sm" style={{ width: `${user.levelProgress}%` }} />
              </div>
            </div>
          </div>
        </ArcadeCard>

        {/* Stats globales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <ArcadeCard key={s.label} variant="default" className="flex flex-col items-center justify-center gap-1.5 py-4 text-center">
              <div className="flex items-center gap-2">{s.icon}</div>
              <span className="font-['Press_Start_2P',monospace] text-sm text-ink">{s.value}</span>
              <span className="text-[10px] text-ink-soft">{s.label}</span>
            </ArcadeCard>
          ))}
        </div>

        {/* Historial completo de la plataforma */}
        <ArcadeCard variant="default" className="p-0 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-surface-2 bg-surface/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-2" />
              <h3 className="font-['Press_Start_2P',monospace] text-xs text-ink">
                HISTORIAL EN TODA LA PLATAFORMA
              </h3>
            </div>
            <span className="text-[10px] text-ink-soft">{activity.length} eventos</span>
          </div>

          <div className="divide-y divide-surface-2">
            {activity.map((act) => (
              <div key={act.id} className="p-4 flex items-center justify-between gap-4 hover:bg-surface/40 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  {act.coins && act.coins < 0 ? (
                    <PixelChest className="w-4 h-4 mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{act.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span
                        className={`text-[10px] bg-canvas border px-1.5 py-0.5 rounded font-mono ${
                          act.courseAccent === 'cyan'
                            ? 'border-brand-2/40 text-brand-2'
                            : 'border-brand/40 text-brand'
                        }`}
                      >
                        {act.course}
                      </span>
                      <span className="text-[10px] text-ink-soft font-mono">{act.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {act.xp && (
                    <span className="font-['Press_Start_2P',monospace] text-[9px] text-brand-2 bg-brand-2/60 border border-brand-2/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      +{act.xp}
                    </span>
                  )}
                  {act.coins !== undefined && (
                    <span
                      className={`font-['Press_Start_2P',monospace] text-[9px] px-2 py-0.5 rounded flex items-center gap-1 border ${
                        act.coins < 0
                          ? 'text-danger bg-danger/40 border-danger/40'
                          : 'text-gold bg-gold/60 border-gold/40'
                      }`}
                    >
                      <i className="nes-icon is-small coin scale-75" />
                      {act.coins > 0 ? '+' : ''}
                      {act.coins}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ArcadeCard>
      </main>
    </div>
  );
};
