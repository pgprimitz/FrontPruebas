import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArcadeNavbar,
  Breadcrumb,
  ArcadeCard,
  ArcadeAvatar,
  ArcadeBadge,
  ArcadeButton,
  ArcadeDrawer,
  ArcadeInput,
  ArcadeSelect,
  ArcadeTextarea,
  ArcadeTable,
  ArcadePagination,
  ArcadeEmptyState,
  ArcadeTooltip,
  XPBar,
  LevelBadge,
  LivesIndicator,
  CoinCounter,
  StreakFlame,
  BadgeShowcase,
  PixelTrophy,
  PixelChest,
  PixelCoin,
  PixelCheck,
  PixelScroll,
} from 'tup-arcade-ui';
import type { ArcadeTableColumn, EarnedBadge } from 'tup-arcade-ui';
import { Mail, MapPin, IdCard, GraduationCap, Clock, Award } from 'lucide-react';

interface PlatformActivity {
  id: string;
  course: string;
  courseAccent: 'cyan' | 'fuchsia';
  title: string;
  date: string;
  xp?: number;
  coins?: number;
}

const ACTIVITY_PAGE_SIZE = 5;

export const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [editOpen, setEditOpen] = useState(false);

  const user = {
    name: 'Tamara Alvarez',
    legajo: '412349',
    email: 'tamara.alvarez@alu.frt.utn.edu.ar',
    location: 'San Miguel de Tucumán, Argentina',
    career: 'Tecnicatura Universitaria en Programación',
    level: 12,
    levelProgress: 82,
  };

  const [form, setForm] = useState({
    displayName: user.name,
    email: user.email,
    location: user.location,
    bio: 'Estudiante de la TUP. Me gusta romper contenedores y después arreglarlos.',
    visibility: 'cohort',
  });

  const stats = [
    { label: 'XP Total', value: '9.850', icon: <span className="font-['Press_Start_2P',monospace] text-brand-2">XP</span> },
    { label: 'Monedas', value: '730', icon: <PixelCoin className="w-4 h-4" /> },
    { label: 'Logros', value: '14', icon: <PixelTrophy className="w-4 h-4" /> },
    { label: 'Cursos Cursados', value: '2', icon: <GraduationCap className="w-4 h-4 text-success" /> },
  ];

  const badges: EarnedBadge[] = [
    { id: 'b1', name: 'SQL Optimizer Lvl 2', description: 'Optimizaste 10 consultas por debajo de 50ms.', earned: true },
    { id: 'b2', name: 'Docker Captain', description: 'Superaste el boss fight de despliegue.', earned: true },
    { id: 'b3', name: 'Racha de 7 días', description: 'Una semana entera sin faltar.', earned: true },
    { id: 'b4', name: 'Pair Programmer', description: 'Resolviste 5 desafíos en dupla.', earned: true },
    { id: 'b5', name: 'Refactor Master', description: 'Todavía bloqueado: refactorizá un módulo completo.', earned: false },
    { id: 'b6', name: 'Zero Bugs', description: 'Todavía bloqueado: entregá un parcial sin errores.', earned: false },
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

  const pageCount = Math.max(1, Math.ceil(activity.length / ACTIVITY_PAGE_SIZE));
  const visibleActivity = activity.slice((page - 1) * ACTIVITY_PAGE_SIZE, page * ACTIVITY_PAGE_SIZE);

  const activityColumns: ArcadeTableColumn<PlatformActivity>[] = [
    {
      key: 'title',
      header: 'Evento',
      render: (row) => (
        <div className="flex items-start gap-3 min-w-0">
          {row.coins !== undefined && row.coins < 0 ? (
            <PixelChest className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <PixelCheck className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span className="text-xs font-bold text-ink">{row.title}</span>
        </div>
      ),
    },
    {
      key: 'course',
      header: 'Curso',
      render: (row) => (
        <ArcadeBadge
          tone={row.courseAccent === 'cyan' ? 'cyan' : 'magenta'}
          appearance="outline"
          size="sm"
        >
          {row.course}
        </ArcadeBadge>
      ),
    },
    {
      key: 'date',
      header: 'Cuándo',
      render: (row) => <span className="text-[10px] text-ink-soft font-mono">{row.date}</span>,
    },
    {
      key: 'reward',
      header: 'Recompensa',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.xp !== undefined && (
            <ArcadeBadge tone="cyan" size="sm" icon={<Award className="w-3 h-3" />}>
              +{row.xp}
            </ArcadeBadge>
          )}
          {row.coins !== undefined && (
            <ArcadeBadge
              tone={row.coins < 0 ? 'red' : 'yellow'}
              size="sm"
              icon={<PixelCoin className="w-3 h-3" />}
            >
              {row.coins > 0 ? '+' : ''}
              {row.coins}
            </ArcadeBadge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col w-full bg-canvas text-ink font-mono">
      <ArcadeNavbar
        user={{ name: 'Tamara', role: 'Estudiante • Lvl 12' }}
        unreadMessages={2}
        unreadNotifications={4}
        onNavigateMessages={() => navigate('/messages')}
        onNavigateNotifications={() => navigate('/notifications')}
        onEditProfile={() => setEditOpen(true)}
        onLogout={() => navigate('/login')}
      />

      <main className="w-full px-4 sm:px-8 py-8">
        <Breadcrumb items={[{ label: 'Perfil' }]} onHome={() => navigate('/my-courses')} />

        <div className="mt-4 mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-['Press_Start_2P',monospace] text-xl md:text-2xl text-brand tracking-wider">
              Mi Perfil
            </h1>
            <p className="text-sm text-ink-soft mt-1">Tus datos de cuenta y tu historial en toda la plataforma.</p>
          </div>
          <ArcadeButton variant="magenta" size="sm" onClick={() => setEditOpen(true)}>
            Editar perfil
          </ArcadeButton>
        </div>

        {/* Datos básicos */}
        <ArcadeCard variant="default" className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <ArcadeAvatar name={user.name} size="xl" level={user.level} ring="magenta" />

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-lg text-ink">{user.name}</h2>
              <LevelBadge level={user.level} name="Compilador" maxLevel={20} />
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
              <XPBar currentXP={user.levelProgress * 10} levelXP={1000} level={user.level} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:border-l sm:border-surface-2 sm:pl-5">
            <LivesIndicator lives={4} maxLives={5} />
            <CoinCounter coins={730} />
            <StreakFlame days={9} />
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

        {/* Logros */}
        <ArcadeCard variant="yellow" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <PixelTrophy className="w-4 h-4" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs text-ink">LOGROS</h3>
          </div>
          <BadgeShowcase badges={badges} />
        </ArcadeCard>

        {/* Historial completo de la plataforma */}
        <ArcadeCard variant="default" padding="none" className="overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-surface-2 bg-surface/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-2" />
              <h3 className="font-['Press_Start_2P',monospace] text-xs text-ink">
                HISTORIAL EN TODA LA PLATAFORMA
              </h3>
            </div>
            <ArcadeTooltip content="Eventos registrados en todas tus cohortes">
              <span className="text-[10px] text-ink-soft">{activity.length} eventos</span>
            </ArcadeTooltip>
          </div>

          <div className="p-4 flex flex-col gap-4">
            <ArcadeTable
              columns={activityColumns}
              rows={visibleActivity}
              rowKey={(row) => row.id}
              emptyState={
                <ArcadeEmptyState
                  title="Sin actividad todavía"
                  description="Cuando completes tu primer desafío, va a aparecer acá."
                  icon={<PixelScroll className="w-10 h-10" />}
                />
              }
            />
            <ArcadePagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </ArcadeCard>
      </main>

      <ArcadeDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar perfil"
        subtitle="Los datos académicos los administra la facultad."
        side="right"
        size="md"
        footer={
          <div className="flex gap-2">
            <ArcadeButton variant="green" size="sm" onClick={() => setEditOpen(false)}>
              Guardar
            </ArcadeButton>
            <ArcadeButton variant="magenta" size="sm" onClick={() => setEditOpen(false)}>
              Cancelar
            </ArcadeButton>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <ArcadeInput
            label="Nombre para mostrar"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
          <ArcadeInput
            label="Correo de contacto"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <ArcadeInput
            label="Ubicación"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <ArcadeSelect
            label="Visibilidad del perfil"
            options={[
              { value: 'public', label: 'Pública en toda la plataforma' },
              { value: 'cohort', label: 'Solo mi cohorte' },
              { value: 'private', label: 'Privada' },
            ]}
            value={form.visibility}
            onChange={(e) => setForm({ ...form, visibility: e.target.value })}
          />
          <ArcadeTextarea
            label="Sobre mí"
            rows={4}
            maxLength={280}
            showCount
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
      </ArcadeDrawer>
    </div>
  );
};
