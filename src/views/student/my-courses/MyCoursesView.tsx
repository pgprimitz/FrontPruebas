import React, { useState } from 'react';
import {
  ArcadeNavbar,
  Breadcrumb,
  ArcadeCard,
  ArcadeButton,
  ArcadeModal,
  ArcadeProgressBar,
  ArcadeEmptyState,
  ArcadeBadge,
  CourseStatusBadge,
  CourseMetaBadges,
  LivesIndicator,
  CoinCounter,
  StreakFlame,
  XPBar,
  PixelFolder,
  PixelLock,
} from 'tup-arcade-ui';
import type { CourseStatus, Difficulty } from 'tup-arcade-ui';
import { Sparkles, Compass, List } from 'lucide-react';

export interface CourseData {
  id: string;
  code: string;
  title: string;
  cohort: string;
  progress: number; // 0 - 100
  lives: number;
  coins: number;
  headerColor: string;
  headerGradient: string;
  icon: string;
  status: CourseStatus;
  difficulty: Difficulty;
  language: string;
  durationMinutes: number;
}

export interface MyCoursesViewProps {
  onNavigateMode?: (courseId: string, mode: 'aventura' | 'simplificado') => void;
  onLogout?: () => void;
  onNavigateMessages?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateProfile?: () => void;
}

const courseStatusLabels: Partial<Record<CourseStatus, string>> = {
  draft: 'Borrador',
  active: 'Cursando',
  archived: 'Archivada',
};

const difficultyLabels: Partial<Record<Difficulty, string>> = {
  beginner: 'Inicial',
  intermediate: 'Intermedia',
  advanced: 'Avanzada',
};

export const MyCoursesView: React.FC<MyCoursesViewProps> = ({
  onNavigateMode,
  onLogout,
  onNavigateMessages,
  onNavigateNotifications,
  onNavigateProfile
}) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [adventureOpen, setAdventureOpen] = useState(false);

  const courses: CourseData[] = [
    {
      id: 'progra-4',
      code: 'Progra IV',
      title: 'Programación IV',
      cohort: '2da Cohorte 2026',
      progress: 65,
      lives: 5,
      coins: 450,
      headerColor: 'bg-brand-2',
      headerGradient: 'header-tint-brand-2',
      icon: '💩',
      status: 'active',
      difficulty: 'advanced',
      language: 'Español',
      durationMinutes: 5400,
    },
    {
      id: 'bdd',
      code: 'BDD',
      title: 'Bases de Datos',
      cohort: '1ta Cohorte 2026',
      progress: 40,
      lives: 4,
      coins: 280,
      headerColor: 'bg-brand',
      headerGradient: 'header-tint-brand',
      icon: '💙',
      status: 'active',
      difficulty: 'intermediate',
      language: 'Español',
      durationMinutes: 3600,
    },
  ];

  const handleChooseMode = (mode: 'aventura' | 'simplificado') => {
    if (selectedCourse) {
      onNavigateMode?.(selectedCourse.id, mode);
      setSelectedCourse(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-canvas text-ink font-mono relative overflow-hidden">
      {/* Scanlines */}
      <div className="crt-overlay absolute inset-0 pointer-events-none z-50" />

      {/* Navbar */}
      <ArcadeNavbar
        user={{
          name: 'Tamara',
          role: 'Estudiante • Lvl 12',
        }}
        unreadMessages={2}
        unreadNotifications={4}
        onNavigateMessages={onNavigateMessages}
        onNavigateNotifications={onNavigateNotifications}
        onEditProfile={onNavigateProfile}
        onLogout={onLogout}
      />

      {/* Content */}
      <main className="w-full px-4 sm:px-8 py-8">
        <Breadcrumb items={[{ label: 'Mis Cursos' }]} />

        <div className="flex items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="font-['Press_Start_2P',monospace] text-xl md:text-2xl text-brand-2 tracking-wider">
              Mis Cursos
            </h1>
            <p className="text-sm text-ink-soft mt-1">
              Seleccioná una cohorte para reanudar tu aventura o revisar el material.
            </p>
          </div>

          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-surface-2 rounded text-xs text-ink-soft">
            <Sparkles className="w-4 h-4 text-brand-2" />
            COHORTES ACTIVAS: {courses.length}
          </span>
        </div>

        {/* Resumen de la cuenta */}
        <ArcadeCard variant="yellow" className="mb-8 p-4 flex flex-wrap items-center gap-6">
          <XPBar currentXP={820} levelXP={1200} level={12} className="min-w-[240px] flex-1" />
          <StreakFlame days={9} />
          <CoinCounter coins={courses.reduce((total, c) => total + c.coins, 0)} />
        </ArcadeCard>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <ArcadeEmptyState
            title="Todavía no tenés cohortes asignadas"
            description="Cuando el sistema académico te inscriba en una materia, va a aparecer acá."
            icon={<PixelFolder className="w-10 h-10" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {courses.map((c) => (
              <ArcadeCard
                key={c.id}
                variant={c.id === 'progra-4' ? 'cyan' : 'magenta'}
                className="p-0 overflow-hidden flex flex-col bg-surface"
              >
                {/* 45% Superior distintiva */}
                <div className={`h-28 w-full relative ${c.headerGradient} px-5 py-4 flex flex-col justify-between border-b border-surface-2`}>
                  {/* Top badges */}
                  <div className="flex items-center justify-between z-10">
                    <span className="font-['Press_Start_2P',monospace] text-xs text-brand-2">
                      {c.cohort}
                    </span>

                    {/* Vidas y monedas de la cohorte */}
                    <div className="flex items-center gap-4">
                      <LivesIndicator lives={c.lives} size="sm" />
                      <CoinCounter coins={c.coins} size="sm" />
                    </div>
                  </div>

                  {/* Title & code (sin icono al lado) */}
                  <div className="flex flex-col z-10">
                    <h2 className="font-['Press_Start_2P',monospace] text-base sm:text-lg text-white">
                      {c.code}
                    </h2>
                    <p className="text-xs text-ink-soft mt-1">{c.title}</p>
                  </div>
                </div>

                {/* 55% Inferior con progreso y botón ver curso */}
                <div className="p-5 flex flex-col justify-between gap-4 bg-surface">
                  <div className="flex flex-wrap items-center gap-2">
                    <CourseStatusBadge status={c.status} labels={courseStatusLabels} size="sm" />
                    <CourseMetaBadges
                      difficulty={c.difficulty}
                      language={c.language}
                      durationMinutes={c.durationMinutes}
                      difficultyLabels={difficultyLabels}
                      size="sm"
                    />
                  </div>

                  <ArcadeProgressBar
                    value={c.progress}
                    max={100}
                    tone={c.id === 'progra-4' ? 'cyan' : 'magenta'}
                    label="Progreso del curso"
                    showValue
                  />

                  <div className="pt-1 flex items-center justify-end">
                    <ArcadeButton
                      variant={c.id === 'progra-4' ? 'cyan' : 'magenta'}
                      size="md"
                      onClick={() => setSelectedCourse(c)}
                    >
                      Ver Curso
                    </ArcadeButton>
                  </div>
                </div>
              </ArcadeCard>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Selección de Modo (Modo Aventura / Modo Speedrun) */}
      <ArcadeModal
        open={selectedCourse !== null}
        onClose={() => setSelectedCourse(null)}
        title="Elegí tu Modo"
        subtitle={selectedCourse?.title}
        tone="yellow"
        size="md"
        footer={
          <ArcadeButton variant="yellow" size="sm" onClick={() => setSelectedCourse(null)}>
            Cancelar
          </ArcadeButton>
        }
      >
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleChooseMode('simplificado')}
            className="group p-4 border border-brand-2/60 bg-brand-2/20 hover:bg-brand-2/40 rounded text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-brand-2/15 border border-brand-2/60 text-brand-2">
                <List className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="font-['Press_Start_2P',monospace] text-xs text-brand-2">
                    Modo Speedrun
                  </p>
                  <ArcadeBadge tone="cyan" size="sm">
                    ACTIVO
                  </ArcadeBadge>
                </div>
                <p className="text-xs text-ink-soft mt-1">
                  Vista estructurada por unidades temáticas, recursos (PDFs, videos) y desafíos.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAdventureOpen(true)}
            className="group p-4 border border-line bg-canvas/40 opacity-70 hover:border-line rounded text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-surface border border-line text-ink-soft">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="font-['Press_Start_2P',monospace] text-xs text-ink-soft">
                    Modo Aventura
                  </p>
                  <ArcadeBadge tone="neutral" appearance="outline" size="sm">
                    PRONTO
                  </ArcadeBadge>
                </div>
                <p className="text-xs text-ink-soft mt-1">
                  Roadmap RPG interactivo, mapas visuales con islas flotantes y avatar.
                </p>
              </div>
            </div>
          </button>
        </div>
      </ArcadeModal>

      <ArcadeModal
        open={adventureOpen}
        onClose={() => setAdventureOpen(false)}
        title="Modo Aventura"
        tone="magenta"
        size="sm"
        footer={
          <ArcadeButton variant="magenta" size="sm" onClick={() => setAdventureOpen(false)}>
            Volver
          </ArcadeButton>
        }
      >
        <ArcadeEmptyState
          title="Todavía en construcción"
          description="El roadmap RPG con islas flotantes y avatar llega en la próxima cohorte."
          icon={<PixelLock className="w-10 h-10" />}
        />
      </ArcadeModal>
    </div>
  );
};
