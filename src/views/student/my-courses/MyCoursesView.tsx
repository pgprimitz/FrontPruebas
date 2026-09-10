import React, { useState } from 'react';
import { ArcadeNavbar, Breadcrumb, ArcadeCard, ArcadeButton } from 'tup-arcade-ui';
import { Sparkles, Compass, List, X } from 'lucide-react';

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
}

export interface MyCoursesViewProps {
  onNavigateMode?: (courseId: string, mode: 'aventura' | 'simplificado') => void;
  onLogout?: () => void;
  onNavigateMessages?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateProfile?: () => void;
}

export const MyCoursesView: React.FC<MyCoursesViewProps> = ({
  onNavigateMode,
  onLogout,
  onNavigateMessages,
  onNavigateNotifications,
  onNavigateProfile
}) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

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

        <div className="flex items-center justify-between mb-8 mt-4">
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
            COHORTES ACTIVAS: 2
          </span>
        </div>

        {/* Course Grid */}
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

                  {/* Vidas & Monedas con NES.css */}
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-danger">
                      <i className="nes-icon is-small heart" style={{ transform: 'scale(1.25)' }} />
                      <span>{c.lives}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gold">
                      <i className="nes-icon is-small coin" style={{ transform: 'scale(1.25)' }} />
                      <span>{c.coins}</span>
                    </span>
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
                {/* Progress Bar */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-soft">Progreso del curso:</span>
                    <span
                      className={`font-['Press_Start_2P',monospace] text-[10px] ${c.id === 'progra-4' ? 'text-brand-2' : 'text-brand'}`}
                    >
                      {c.progress}%
                    </span>
                  </div>

                  <div className="w-full h-3 bg-canvas border border-surface-2 rounded-sm p-0.5">
                    <div
                      className={`h-full rounded-sm transition-all ${c.id === 'progra-4' ? 'bg-brand-2' : 'bg-brand'}`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>

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
      </main>

      {/* Modal de Selección de Modo (Modo Aventura / Modo Speedrun) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/40 backdrop-blur-[2px]">
          <ArcadeCard
            variant="yellow"
            className="w-full max-w-md p-6 bg-surface"
          >
            <div className="flex items-center justify-between mb-4 border-b border-surface-2 pb-3">
              <div>
                <h3 className="font-['Press_Start_2P',monospace] text-sm text-gold">
                  Eligé tu Modo
                </h3>
                <p className="text-xs text-ink-soft mt-0.5">{selectedCourse.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="p-1 text-ink-soft hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 my-6">
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
                      <span className="font-['Press_Start_2P',monospace] text-[8px] bg-surface-2 text-ink-soft px-1.5 py-0.5 rounded transition-colors group-hover:bg-brand-2 group-hover:text-slate-950">
                        ACTIVO
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft mt-1">
                      Vista estructurada por unidades temáticas, recursos (PDFs, videos) y desafíos.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => alert('El Modo Aventura estará disponible próximamente.')}
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
                      <span className="font-['Press_Start_2P',monospace] text-[8px] bg-surface-2 text-ink-soft px-1.5 py-0.5 rounded transition-colors group-hover:bg-gold group-hover:text-slate-950">
                        PRONTO
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft mt-1">
                      Roadmap RPG interactivo, mapas visuales con islas flotantes y avatar.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="text-xs text-ink-soft hover:text-ink cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </ArcadeCard>
        </div>
      )}
    </div>
  );
};
