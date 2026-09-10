import React, { useState } from 'react';
import {
  ArcadeNavbar,
  Breadcrumb,
  ArcadeCard,
  PixelTrophy,
  PixelChest,
  PixelChat,
  PixelUser
} from 'tup-arcade-ui';
import { 
  Map, 
  FileText, 
  Video, 
  BookOpen, 
  Swords, 
  ArrowLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Send,
  Sparkles,
  Award,
  Clock,
  Shield,
  Zap,
  Flame,
  CheckCircle2,
  X
} from 'lucide-react';

export type SidebarTab = 'roadmap' | 'ranking' | 'shop' | 'chat' | 'profile';
export type UnitCategory = 'theoretical' | 'audiovisual' | 'support' | 'challenges';

export interface ResourceItem {
  id: string;
  type: 'pdf' | 'video' | 'text' | 'challenge';
  title: string;
  durationOrSize?: string;
  completed?: boolean;
  xp?: number;
  description?: string;
  /** Si tiene contenido, el material se lee dentro de la plataforma y hay
   * que hacer scroll hasta el final para poder marcarlo como leído. */
  longContent?: string;
}

export interface UnitData {
  id: string;
  name: string;
  title: string;
  description: string;
  progress: number;
  resources: {
    theoretical: ResourceItem[];
    audiovisual: ResourceItem[];
    supportMaterial: ResourceItem[];
    challenges: ResourceItem[];
  };
}

export interface SimplifiedCourseViewProps {
  onBackToCourses?: () => void;
  onLogout?: () => void;
  onNavigateMessages?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateProfile?: () => void;
}

export const SimplifiedCourseView: React.FC<SimplifiedCourseViewProps> = ({
  onBackToCourses,
  onLogout,
  onNavigateMessages,
  onNavigateNotifications,
  onNavigateProfile
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('roadmap');
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [activeCategory, setActiveCategory] = useState<UnitCategory>('theoretical');

  const tabLabels: Record<Exclude<SidebarTab, 'roadmap'>, string> = {
    ranking: 'Ranking',
    shop: 'Mercado de Canje',
    chat: 'Chat de Cohorte',
    profile: 'Perfil',
  };

  const goToCourseRoot = () => {
    setActiveTab('roadmap');
    setSelectedUnit(null);
  };

  const breadcrumbItems = [
    { label: 'Cursos', onClick: onBackToCourses },
    { label: 'Programación IV', onClick: activeTab !== 'roadmap' || selectedUnit ? goToCourseRoot : undefined },
    ...(activeTab !== 'roadmap' ? [{ label: tabLabels[activeTab] }] : []),
    ...(activeTab === 'roadmap' && selectedUnit ? [{ label: selectedUnit.name }] : []),
  ];

  // Datos de unidades
  const units: UnitData[] = [
    {
      id: 'u1',
      name: 'U1',
      title: 'Unidad 1: Arquitectura y Despliegue',
      description: 'Fundamentos de arquitecturas frontend y backend, microfrontends, pipelines y estándares.',
      progress: 100,
      resources: {
        theoretical: [
          { id: 't1', type: 'pdf', title: 'TUP_PIV_FE_TEO_U1_ARQUITECTURA_DESPLIEGUE.pdf', durationOrSize: '2.4 MB', completed: true, description: 'Microfrontends, Webpack Module Federation y despliegues modernos.' },
          { id: 't2', type: 'pdf', title: 'TUP_PIV_BE_PROPUESTA_ARQ.pdf', durationOrSize: '1.8 MB', completed: true, description: 'Arquitectura hexagonal en C# y Clean Architecture.' },
        ],
        audiovisual: [
          { id: 'v1', type: 'video', title: 'Masterclass: Despliegue de Single Page Apps en Vercel & Docker', durationOrSize: '42 min', completed: true, description: 'Video explicativo paso a paso con terminal en vivo.' },
          { id: 'v2', type: 'video', title: 'Patrón Adapter y Ports en Backend .NET', durationOrSize: '28 min', completed: true, description: 'Demostración práctica de desacoplamiento.' },
        ],
        supportMaterial: [
          {
            id: 's1',
            type: 'text',
            title: 'Guía de Comandos Docker y CI/CD GitHub Actions',
            durationOrSize: 'Cheat Sheet',
            completed: true,
            description: 'Comandos esenciales y snippets yaml listos para copiar.',
            longContent: `Esta guía resume los comandos que vas a usar todo el cuatrimestre para levantar, depurar y desplegar los contenedores de la cátedra.

1. Comandos básicos de Docker
docker build -t mi-imagen:1.0 . — construye una imagen a partir del Dockerfile del directorio actual.
docker run -p 3000:3000 mi-imagen:1.0 — corre el contenedor y mapea el puerto 3000 del host al del contenedor.
docker ps — lista los contenedores corriendo. Agregá -a para ver también los detenidos.
docker logs -f <container> — sigue los logs en vivo, fundamental para debuggear un healthcheck que falla.

2. Multi-stage builds
La clave para bajar el tamaño final de la imagen es separar la etapa de build de la etapa de runtime. En la primera instalás dependencias y compilás; en la segunda copiás solo el resultado (dist/ o build/) a una imagen liviana como nginx:alpine. Esto es exactamente lo que se evalúa en el Desafío 1.

3. Docker Compose para desarrollo
version: "3.9"
services:
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
  backend:
    build: ./backend
    environment:
      - DB_HOST=postgres
    depends_on: [postgres]
  postgres:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=devpass

Con esto levantás los tres servicios con un solo docker compose up. Recordá nunca commitear el .env con las contraseñas reales.

4. Reverse proxy con Nginx
El Boss Fight de la Unidad 1 pide un nginx.conf que redirija /api hacia el backend y sirva el build del frontend en /. El bloque típico es:

location /api/ {
  proxy_pass http://backend:8080/;
}
location / {
  try_files $uri /index.html;
}

5. Pipeline de GitHub Actions
El workflow mínimo que la cátedra espera corre en cada push a main: instala dependencias, corre lint y tests, y si todo pasa, construye y publica la imagen. Un esqueleto típico:

name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: docker build -t app:\${{ github.sha }} .

6. Errores comunes
Si el healthcheck del contenedor nunca pasa a "healthy", revisá que el puerto expuesto coincida con el que escucha la app adentro del contenedor (no el del host). Si el build tarda demasiado, revisá que el .dockerignore excluya node_modules — sin eso, Docker copia y reconstruye capas innecesarias en cada build.

Con esto ya tenés todo lo necesario para resolver el Desafío 1 y el Boss Fight de la unidad. Cualquier duda puntual, consultala en el canal de chat de la cohorte.`,
          },
          { id: 's2', type: 'text', title: 'Repositorio Template de Microfrontends (GitHub)', durationOrSize: 'Enlace Web', completed: true, description: 'Repo base para clonar y comenzar los desafíos de cátedra.' },
        ],
        challenges: [
          { id: 'c1', type: 'challenge', title: 'Desafío 1: Configurar Dockerfile multi-stage', durationOrSize: '+200 XP', completed: true, xp: 200, description: 'Compilar y empaquetar una app Vite en Nginx con menos de 30MB.' },
          { id: 'c2', type: 'challenge', title: 'Boss Fight: Healthcheck & Reverse Proxy Nginx', durationOrSize: '+400 XP', completed: true, xp: 400, description: 'Configurar ruteo entre contenedor frontend y backend.' },
        ]
      }
    },
    {
      id: 'u2',
      name: 'U2',
      title: 'Unidad 2: Component-Driven Development',
      description: 'Librerías de componentes atómicos, diseño retro y estándares accesibles.',
      progress: 60,
      resources: {
        theoretical: [
          { id: 't3', type: 'pdf', title: 'TUP_PIV_FE_TEO_U2_COMPONENT_DRIVEN.pdf', durationOrSize: '3.1 MB', completed: true, description: 'Metodología Atomic Design aplicada a interfaces interactivas.' },
        ],
        audiovisual: [
          { id: 'v3', type: 'video', title: 'Construyendo un Design System Pixel-Art con Tailwind', durationOrSize: '35 min', completed: true, description: 'Técnicas de sombreado beveled y fuentes monospace.' },
        ],
        supportMaterial: [
          { id: 's3', type: 'text', title: 'Documentación interactiva NES.css y Sprites', durationOrSize: 'Enlace Web', completed: false, description: 'Catálogo de iconos e inputs estilo retro gaming.' },
        ],
        challenges: [
          { id: 'c3', type: 'challenge', title: 'Desafío 2: Crear ArcadeCard reutilizable', durationOrSize: '+250 XP', completed: false, xp: 250, description: 'Implementar props variant y esquinas pixeladas.' },
        ]
      }
    },
    {
      id: 'u3',
      name: 'U3',
      title: 'Unidad 3: Estado Global y Gestión',
      description: 'Manejo reactivo, autenticación JWT, guards de navegación y websockets.',
      progress: 15,
      resources: {
        theoretical: [
          { id: 't4', type: 'pdf', title: 'TUP_PIV_FE_TEO_U3_ESTADO_REACTIVO.pdf', durationOrSize: '2.0 MB', completed: false, description: 'Context API vs Zustand vs Redux Toolkit.' },
        ],
        audiovisual: [
          { id: 'v4', type: 'video', title: 'Gestión de Sesión con Refresh Tokens y Axios Interceptors', durationOrSize: '50 min', completed: false, description: 'Manejo seguro de credenciales en navegador.' },
        ],
        supportMaterial: [
          { id: 's4', type: 'text', title: 'Diagrama de Flujo de Autenticación', durationOrSize: 'PDF 1 pág', completed: false, description: 'Secuencia completa Alumno -> Auth Server -> Gateway.' },
        ],
        challenges: [
          { id: 'c4', type: 'challenge', title: 'Desafío 3: Proteger Rutas con AuthGuard', durationOrSize: '+300 XP', completed: false, xp: 300, description: 'Redirigir a /login si no hay token válido.' },
        ]
      }
    },
  ];

  // Estado de "hecho" de material teórico y de apoyo. Arranca siempre en "no visto".
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});

  // Material extenso abierto en el lector in-app (requiere scroll hasta el final)
  const [readerItem, setReaderItem] = useState<ResourceItem | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  const handleOpenResource = (item: ResourceItem) => {
    if (item.longContent) {
      setReachedEnd(false);
      setReaderItem(item);
      return;
    }
    alert('Abriendo material: ' + item.title);
    setReadMap((prev) => ({ ...prev, [item.id]: true }));
  };

  const handleToggleRead = (item: ResourceItem) => {
    // Si es un texto extenso, la única forma de marcarlo leído es llegando al final del lector.
    if (item.longContent && !readMap[item.id]) {
      handleOpenResource(item);
      return;
    }
    setReadMap((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
  };

  const handleReaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
      setReachedEnd(true);
    }
  };

  const confirmReaderRead = () => {
    if (!readerItem) return;
    setReadMap((prev) => ({ ...prev, [readerItem.id]: true }));
    setReaderItem(null);
  };

  // Ranking data (Top 10 + current user)
  const rankingList = [
    { rank: 1, name: 'Facundo Ramirez', xp: 14850, level: 16, avatar: '👑', badge: 'Archimago Dev' },
    { rank: 2, name: 'Sofia Rodriguez', xp: 13920, level: 15, avatar: '🥈', badge: 'Hexagonal Knight' },
    { rank: 3, name: 'Lucas Benitez', xp: 12400, level: 14, avatar: '🥉', badge: 'Docker Master' },
    { rank: 4, name: 'Mateo Lopez', xp: 11800, level: 14, avatar: '👾', badge: 'Frontend Guru' },
    { rank: 5, name: 'Valentina Díaz', xp: 11150, level: 13, avatar: '⚡', badge: 'Fullstacker' },
    { rank: 6, name: 'Joaquin Perez', xp: 10800, level: 13, avatar: '🛡️', badge: 'Code Guardian' },
    { rank: 7, name: 'Camila Gomez', xp: 10250, level: 13, avatar: '🔮', badge: 'Bug Hunter' },
    { rank: 8, name: 'Tamara (Tú)', xp: 9850, level: 12, avatar: '⭐', isMe: true, badge: 'Retro Challenger' },
    { rank: 9, name: 'Nicolas Romero', xp: 9400, level: 12, avatar: '🗡️', badge: 'Unit Tester' },
    { rank: 10, name: 'Agustina Fernandez', xp: 9100, level: 11, avatar: '📜', badge: 'Clean Coder' },
  ];

  // Mercado items
  const shopItems = [
    { id: 's1', name: 'Poción de Vida', desc: '+1 Vida extra para exámenes y desafíos.', price: 150, icon: <i className="nes-icon is-small heart" />, tag: 'CONSUMIBLE' },
    { id: 's2', name: 'Pista de Docente', desc: 'Desbloquea pista oficial en el próximo Boss Fight.', price: 300, icon: <Sparkles className="w-5 h-5 text-gold" />, tag: 'VENTAJA' },
    { id: 's3', name: 'Emblema "Pixel Master"', desc: 'Distintivo holográfico animado para tu perfil.', price: 500, icon: <Award className="w-5 h-5 text-brand-2" />, tag: 'COSMÉTICO' },
    { id: 's4', name: 'Escudo Anti-Falla', desc: 'Inmune a pérdida de racha por 48 hs.', price: 250, icon: <Shield className="w-5 h-5 text-success" />, tag: 'BUFF' },
    { id: 's5', name: 'Tema Retro Monocromo', desc: 'Skin estilo GameBoy original para la plataforma.', price: 400, icon: <Zap className="w-5 h-5 text-brand" />, tag: 'SKIN' },
    { id: 's6', name: 'Rol VIP en Discord', desc: 'Canal exclusivo con ayudantes de cátedra.', price: 600, icon: <Flame className="w-5 h-5 text-orange-400" />, tag: 'COMUNIDAD' },
  ];

  // Chat messages
  const [chatMessages, setChatMessages] = useState([
    { id: 'cm1', user: 'Prof. Carlos Rossi', text: '¡Bienvenidos a la Unidad 1! Consulten dudas sobre Docker en este canal.', time: '09:30', isTeacher: true },
    { id: 'cm2', user: 'Lucas Benitez', text: '¿El archivo .env de ejemplo va en la raíz o adentro del backend?', time: '10:15' },
    { id: 'cm3', user: 'Tamara', text: 'Lucas, va en la raíz del backend con las variables de conexión a Postgres.', time: '10:22', isMe: true },
    { id: 'cm4', user: 'Prof. Carlos Rossi', text: 'Exacto Tamara. Recuerden no subir nunca el .env con passwords al repo público.', time: '10:30', isTeacher: true },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        id: `cm_${Date.now()}`,
        user: 'Tamara',
        text: chatInput.trim(),
        time: 'Ahora',
        isMe: true
      }
    ]);
    setChatInput('');
  };

  // Historial de actividades en todos los cursos
  const activityHistory = [
    { id: 'a1', course: 'Programación IV', title: 'Completó Desafío: Dockerfile Multi-stage', date: 'Hoy, 02:40 AM', xp: '+200 XP', coins: '+30' },
    { id: 'a2', course: 'Programación IV', title: 'Descargó Apunte: Arquitectura y Despliegue', date: 'Ayer, 18:15', xp: '+25 XP' },
    { id: 'a3', course: 'Base de Datos II', title: 'Aprobó Cuestionario: Índices B-Tree y Planes de Ejecución', date: 'Hace 3 días', xp: '+350 XP', coins: '+50' },
    { id: 'a4', course: 'Base de Datos II', title: 'Desbloqueó Logro: "SQL Optimizer Lvl 2"', date: 'Hace 4 días', xp: '+100 XP' },
    { id: 'a5', course: 'Programación IV', title: 'Ingresó a la 2da Cohorte 2026', date: 'Hace 1 semana', xp: '+50 XP' },
  ];

  return (
    <div className="min-h-screen w-full bg-canvas text-ink font-mono relative overflow-hidden">
      <div className="crt-overlay absolute inset-0 pointer-events-none z-50" />

      <ArcadeNavbar
        user={{ name: 'Tamara', role: 'Estudiante • Lvl 12' }}
        unreadMessages={2}
        unreadNotifications={4}
        onNavigateMessages={onNavigateMessages}
        onNavigateNotifications={onNavigateNotifications}
        onEditProfile={onNavigateProfile}
        onLogout={onLogout}
      />

      {/* Breadcrumb */}
      <div className="bg-canvas border-b border-surface px-4 sm:px-8 py-2">
        <Breadcrumb items={breadcrumbItems} onHome={onBackToCourses} />
      </div>

      {/* Header secundario del Curso */}
      <div className="bg-surface border-b border-surface-2 px-4 sm:px-8 py-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToCourses}
              className="p-1.5 rounded bg-canvas border border-line hover:border-brand-2 text-ink-soft hover:text-brand-2 transition-all cursor-pointer"
              title="Volver a Mis Cursos"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Press_Start_2P',monospace] text-xs text-brand-2">
                  Programación IV
                </span>
                <span className="text-[9px] bg-brand-2/15 border border-brand-2/50 text-brand-2 px-1.5 py-0.5 rounded font-['Press_Start_2P',monospace]">
                  MODO SPEEDRUN
                </span>
              </div>
              <p className="text-[11px] text-ink-soft">2da Cohorte 2026 • Cátedra TUP</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-danger bg-canvas px-3 py-1.5 rounded border border-surface-2">
              <i className="nes-icon is-small heart" style={{ transform: 'scale(1.25)' }} />
              <span>5</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gold bg-canvas px-3 py-1.5 rounded border border-surface-2">
              <i className="nes-icon is-small coin" style={{ transform: 'scale(1.25)' }} />
              <span>450</span>
            </span>
          </div>
        </div>
      </div>

      {/* Layout Sidebar + Contenido */}
      <div className="w-full px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Lateral */}
        <aside className="lg:col-span-3 flex flex-col gap-2">
          {/* SI HAY UNA UNIDAD SELECCIONADA: El menú lateral se transforma en los 4 recursos */}
          {selectedUnit ? (
            <div className="bg-surface border border-surface-2 rounded p-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setSelectedUnit(null)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-left text-xs text-brand-2 hover:bg-brand-2/40 transition-all cursor-pointer font-bold border border-dashed border-brand-2/40 mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al Roadmap</span>
              </button>

              <div className="px-1 py-1 border-b border-surface-2">
                <p className="font-['Press_Start_2P',monospace] text-[10px] text-brand-2 truncate">
                  {selectedUnit.name}: {selectedUnit.title.split(':')[1] || selectedUnit.title}
                </p>
                <p className="text-[10px] text-ink-soft mt-1">Navegación de recursos:</p>
              </div>

              {[
                { key: 'theoretical', label: 'Material Teórico', icon: <FileText className="w-4 h-4 text-brand-2" />, count: selectedUnit.resources.theoretical.length },
                { key: 'audiovisual', label: 'Recursos Audiovisuales', icon: <Video className="w-4 h-4 text-gold" />, count: selectedUnit.resources.audiovisual.length },
                { key: 'support', label: 'Material de Apoyo', icon: <BookOpen className="w-4 h-4 text-success" />, count: selectedUnit.resources.supportMaterial.length },
                { key: 'challenges', label: 'Desafíos', icon: <Swords className="w-4 h-4 text-brand" />, count: selectedUnit.resources.challenges.length },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveCategory(item.key as UnitCategory)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left transition-all cursor-pointer ${
                    activeCategory === item.key
                      ? 'bg-brand-2/20 border border-brand-2 text-brand-2 font-bold shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                      : 'text-ink-soft hover:bg-surface-2/80 hover:text-ink border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <span className="text-[10px] bg-canvas px-1.5 py-0.5 rounded text-ink-soft font-mono">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* MENÚ LATERAL PRINCIPAL CUANDO NO HAY UNIDAD ABIERTA */
            <div className="bg-surface border border-surface-2 rounded p-3 flex flex-col gap-1.5">
              <span className="font-['Press_Start_2P',monospace] text-[10px] text-ink-soft px-2 py-1 mb-1">
                MENU LATERAL
              </span>

              <button
                type="button"
                onClick={() => { setActiveTab('roadmap'); setSelectedUnit(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left transition-all cursor-pointer ${
                  activeTab === 'roadmap'
                    ? 'bg-brand-2/20 border border-brand-2 text-brand-2 font-bold shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                    : 'text-ink-soft hover:bg-surface-2/80 hover:text-ink border border-transparent'
                }`}
              >
                <Map className="w-4 h-4 text-brand-2" />
                <span className="text-xs">Roadmap (por defecto)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ranking')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left transition-all cursor-pointer ${
                  activeTab === 'ranking'
                    ? 'bg-gold/20 border border-gold text-gold font-bold shadow-[0_0_8px_rgba(251,191,36,0.25)]'
                    : 'text-ink-soft hover:bg-surface-2/80 hover:text-ink border border-transparent'
                }`}
              >
                <PixelTrophy className="w-4 h-4" />
                <span className="text-xs">Ranking</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('shop')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left transition-all cursor-pointer ${
                  activeTab === 'shop'
                    ? 'bg-success/20 border border-success text-success font-bold shadow-[0_0_8px_rgba(52,211,153,0.25)]'
                    : 'text-ink-soft hover:bg-surface-2/80 hover:text-ink border border-transparent'
                }`}
              >
                <PixelChest className="w-4 h-4" />
                <span className="text-xs">Mercado de Canje</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-brand/20 border border-brand text-brand font-bold shadow-[0_0_8px_rgba(217,70,239,0.25)]'
                    : 'text-ink-soft hover:bg-surface-2/80 hover:text-ink border border-transparent'
                }`}
              >
                <PixelChat className="w-4 h-4" />
                <span className="text-xs">Chat de Cohorte</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-brand/20 border border-brand text-brand font-bold shadow-[0_0_8px_rgba(129,140,248,0.25)]'
                    : 'text-ink-soft hover:bg-surface-2/80 hover:text-ink border border-transparent'
                }`}
              >
                <PixelUser className="w-4 h-4" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold">Perfil de cursos</span>
                  <span className="text-[9px] text-ink-soft">Info y actividades</span>
                </div>
              </button>
            </div>
          )}
        </aside>

        {/* Área Central Principal */}
        <main className="lg:col-span-9 flex flex-col gap-6">
          {/* TAB 1: ROADMAP (Lista de Unidades o Detalle de Unidad) */}
          {activeTab === 'roadmap' && !selectedUnit && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-brand-2">
                  Unidades Programación IV
                </h2>
                <p className="text-xs text-ink-soft mt-1">
                  Elegí una unidad para acceder al desglose de su contenido teórico, audiovisual, apoyo y desafíos.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {units.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => { setSelectedUnit(u); setActiveCategory('theoretical'); }}
                    className="p-4 rounded border border-surface-2 bg-surface/70 hover:border-brand-2 transition-all cursor-pointer flex items-center justify-between group hover:bg-surface"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded bg-canvas border border-brand-2/60 group-hover:border-brand-2 flex items-center justify-center font-['Press_Start_2P',monospace] text-xs text-brand-2">
                        {u.name}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-ink group-hover:text-brand-2 transition-colors">
                          {u.title}
                        </h3>
                        <p className="text-xs text-ink-soft mt-0.5 line-clamp-1">{u.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-32 bg-canvas h-2 rounded-full overflow-hidden border border-surface-2">
                            <div className="bg-brand-2 h-full rounded-full" style={{ width: `${u.progress}%` }} />
                          </div>
                          <span className="text-[10px] text-brand-2 font-['Press_Start_2P',monospace]">{u.progress}%</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-brand-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETALLE DE UNIDAD SELECCIONADA */}
          {activeTab === 'roadmap' && selectedUnit && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded border border-surface-2 bg-surface flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-['Press_Start_2P',monospace] text-brand-2">{selectedUnit.name}</span>
                  <h2 className="font-bold text-base text-ink mt-0.5">{selectedUnit.title}</h2>
                  <p className="text-xs text-ink-soft mt-1">{selectedUnit.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-2 font-['Press_Start_2P',monospace]">{selectedUnit.progress}%</span>
                  <p className="text-[10px] text-ink-soft">Progreso</p>
                </div>
              </div>

              {/* Lista de Contenidos limpios de la sección activa */}
              <div className="p-4 rounded border border-surface-2 bg-surface/60 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-surface-2">
                  <h3 className="font-['Press_Start_2P',monospace] text-xs text-brand-2">
                    {activeCategory === 'theoretical' && 'MATERIAL TEÓRICO (PDF / DOCUMENTOS)'}
                    {activeCategory === 'audiovisual' && 'RECURSOS AUDIOVISUALES (VIDEOS / CLASES)'}
                    {activeCategory === 'support' && 'MATERIAL DE APOYO (REPOSITORIOS / GUÍAS)'}
                    {activeCategory === 'challenges' && 'DESAFÍOS & BOSS FIGHTS (CUESTIONARIOS / CÓDIGO)'}
                  </h3>
                </div>

                <div className="flex flex-col gap-2.5">
                  {activeCategory === 'theoretical' && selectedUnit.resources.theoretical.map((item) => (
                    <div key={item.id} className="p-3 bg-canvas border border-surface-2 rounded flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-brand-2 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink">{item.title}</p>
                          <p className="text-[11px] text-ink-soft mt-0.5">{item.description}</p>
                          <span className="text-[10px] text-ink-soft font-mono mt-1 inline-block">{item.durationOrSize}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleRead(item)}
                          title={readMap[item.id] ? 'Hecho' : 'Marcar como Hecho'}
                          className={`h-8 px-2.5 rounded border cursor-pointer transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                            readMap[item.id]
                              ? 'bg-success/60 border-success text-success'
                              : 'bg-surface border-line text-ink-soft hover:border-ink-soft hover:text-ink-soft'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{readMap[item.id] ? 'Hecho' : 'Marcar como Hecho'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenResource(item)}
                          className="h-8 px-2.5 rounded bg-brand-2/15 border border-brand-2/40 text-brand-2 text-[11px] hover:bg-brand-2/25 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Abrir</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {activeCategory === 'audiovisual' && selectedUnit.resources.audiovisual.map((item) => (
                    <div key={item.id} className="p-3 bg-canvas border border-surface-2 rounded flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-gold shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-ink">{item.title}</p>
                          <p className="text-[11px] text-ink-soft mt-0.5">{item.description}</p>
                          <span className="text-[10px] text-ink-soft font-mono mt-1 inline-block">{item.durationOrSize}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Reproduciendo video: ' + item.title)}
                        className="px-3 py-1.5 rounded bg-gold/15 border border-gold/40 text-gold text-xs hover:bg-gold/25 cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </button>
                    </div>
                  ))}

                  {activeCategory === 'support' && selectedUnit.resources.supportMaterial.map((item) => (
                    <div key={item.id} className="p-3 bg-canvas border border-surface-2 rounded flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <BookOpen className="w-5 h-5 text-success shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink">{item.title}</p>
                          <p className="text-[11px] text-ink-soft mt-0.5">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-ink-soft font-mono">{item.durationOrSize}</span>
                            {item.longContent && (
                              <span className="text-[9px] text-success border border-success/40 bg-success/30 px-1.5 py-0.5 rounded">
                                LECTURA COMPLETA REQUERIDA
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleRead(item)}
                          title={readMap[item.id] ? 'Hecho' : 'Marcar como Hecho'}
                          className={`h-8 px-2.5 rounded border cursor-pointer transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                            readMap[item.id]
                              ? 'bg-success/60 border-success text-success'
                              : 'bg-surface border-line text-ink-soft hover:border-ink-soft hover:text-ink-soft'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{readMap[item.id] ? 'Hecho' : 'Marcar como Hecho'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenResource(item)}
                          className="h-8 px-2.5 rounded bg-success/15 border border-success/40 text-success text-[11px] hover:bg-success/25 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          {item.longContent ? <BookOpen className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                          <span>{item.longContent ? 'Leer' : 'Explorar'}</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {activeCategory === 'challenges' && selectedUnit.resources.challenges.map((item) => (
                    <div key={item.id} className="p-3 bg-canvas border border-surface-2 rounded flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Swords className="w-5 h-5 text-brand shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-ink">{item.title}</p>
                          <p className="text-[11px] text-ink-soft mt-0.5">{item.description}</p>
                          <span className="text-[10px] text-brand font-['Press_Start_2P',monospace] mt-1 inline-block">{item.durationOrSize}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Iniciando desafío interactivo: ' + item.title)}
                        className="px-3 py-1.5 rounded bg-brand/15 border border-brand text-brand text-xs font-bold hover:bg-brand/25 cursor-pointer flex items-center gap-1.5 shrink-0 shadow-[0_0_8px_rgba(217,70,239,0.3)]"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Batallar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RANKING (Podio Top 3 + Lista Top 10 + Fila Usuario) */}
          {activeTab === 'ranking' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-gold flex items-center gap-2">
                    <PixelTrophy className="w-5 h-5" /> LEADERBOARD DE COHORTE
                  </h2>
                  <p className="text-xs text-ink-soft mt-1">Los estudiantes más destacados por XP acumulado en desafíos.</p>
                </div>
              </div>

              {/* PODIO TOP 3 */}
              <div className="grid grid-cols-3 gap-3 items-end pt-8 pb-2">
                {/* 2do Puesto */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">{rankingList[1].avatar}</span>
                  <div className="font-['Press_Start_2P',monospace] text-[9px] text-ink-soft truncate max-w-full">{rankingList[1].name}</div>
                  <span className="text-[10px] text-ink-soft font-mono">{rankingList[1].xp} XP</span>
                  <div className="w-full h-24 bg-surface-2 border-t-4 border-ink-soft rounded-t flex flex-col items-center justify-center mt-2 shadow-lg">
                    <span className="font-['Press_Start_2P',monospace] text-xl text-ink-soft">#2</span>
                    <span className="text-[9px] text-ink-soft">PLATA</span>
                  </div>
                </div>

                {/* 1er Puesto (Más alto) */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <i className="nes-icon is-small trophy absolute -top-4 -right-3" />
                    <span className="text-3xl mb-1">{rankingList[0].avatar}</span>
                  </div>
                  <div className="font-['Press_Start_2P',monospace] text-[10px] text-gold truncate max-w-full font-bold">{rankingList[0].name}</div>
                  <span className="text-xs text-gold font-mono font-bold">{rankingList[0].xp} XP</span>
                  <div className="w-full h-32 bg-gold/60 border-t-4 border-gold rounded-t flex flex-col items-center justify-center mt-2 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    <span className="font-['Press_Start_2P',monospace] text-2xl text-gold">#1</span>
                    <span className="text-[10px] font-['Press_Start_2P',monospace] text-gold">ORO</span>
                  </div>
                </div>

                {/* 3er Puesto */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">{rankingList[2].avatar}</span>
                  <div className="font-['Press_Start_2P',monospace] text-[9px] text-gold truncate max-w-full">{rankingList[2].name}</div>
                  <span className="text-[10px] text-ink-soft font-mono">{rankingList[2].xp} XP</span>
                  <div className="w-full h-18 bg-gold/40 border-t-4 border-gold rounded-t flex flex-col items-center justify-center mt-2 shadow-lg">
                    <span className="font-['Press_Start_2P',monospace] text-lg text-gold">#3</span>
                    <span className="text-[9px] text-gold">BRONCE</span>
                  </div>
                </div>
              </div>

              {/* LISTA TOP 10 */}
              <div className="bg-surface border border-surface-2 rounded overflow-hidden">
                <div className="p-3 bg-canvas/80 border-b border-surface-2 text-[10px] font-['Press_Start_2P',monospace] text-ink-soft grid grid-cols-12 gap-2">
                  <span className="col-span-2">POS</span>
                  <span className="col-span-6">ALUMNO</span>
                  <span className="col-span-2 text-center">NIVEL</span>
                  <span className="col-span-2 text-right">XP</span>
                </div>

                <div className="divide-y divide-surface-2">
                  {rankingList.map((st) => (
                    <div
                      key={st.rank}
                      className={`p-3 grid grid-cols-12 gap-2 items-center text-xs transition-colors ${
                        st.isMe
                          ? 'bg-brand-2/60 border-l-4 border-brand-2 font-bold text-brand-2'
                          : 'hover:bg-surface-2/40'
                      }`}
                    >
                      <span className="col-span-2 font-['Press_Start_2P',monospace] text-[10px] text-ink-soft">
                        #{st.rank}
                      </span>
                      <div className="col-span-6 flex items-center gap-2 truncate">
                        <span>{st.avatar}</span>
                        <span className="truncate">{st.name}</span>
                        <span className="hidden sm:inline-block text-[9px] bg-surface-2 text-ink-soft px-1.5 py-0.5 rounded font-mono">
                          {st.badge}
                        </span>
                      </div>
                      <span className="col-span-2 text-center text-ink-soft font-mono">Lvl {st.level}</span>
                      <span className="col-span-2 text-right font-['Press_Start_2P',monospace] text-[10px] text-gold">
                        {st.xp.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fila de Posición del Usuario Actual */}
              <div className="p-3 rounded bg-brand-2/40 border border-brand-2/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-brand-2/60 border border-brand-2 flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] text-brand-2">
                    #8
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-2">Tu Posición Actual: Puesto #8</span>
                    <p className="text-[10px] text-ink-soft">Estás a solo 400 XP de subir al puesto #7.</p>
                  </div>
                </div>
                <span className="font-['Press_Start_2P',monospace] text-xs text-gold">9,850 XP</span>
              </div>
            </div>
          )}

          {/* TAB 3: MERCADO DE CANJE */}
          {activeTab === 'shop' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-surface-2">
                <div>
                  <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-success flex items-center gap-2">
                    <PixelChest className="w-5 h-5" /> MERCADO DE CANJE ARCADE
                  </h2>
                  <p className="text-xs text-ink-soft mt-1">Canjeá tus monedas acumuladas por ítems, pistas y cosméticos.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-surface border border-gold/50 px-3 py-1.5 rounded">
                  <i className="nes-icon is-small coin" />
                  <span className="font-['Press_Start_2P',monospace] text-xs text-gold">450</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItems.map((item) => (
                  <div key={item.id} className="p-4 rounded border border-surface-2 bg-surface flex flex-col justify-between gap-3 hover:border-success transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded bg-canvas border border-surface-2 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className="text-[9px] font-['Press_Start_2P',monospace] text-ink-soft bg-canvas px-1.5 py-0.5 rounded">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs text-ink">{item.name}</h3>
                      <p className="text-[11px] text-ink-soft mt-1">{item.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-surface-2/80">
                      <div className="flex items-center gap-1 text-gold font-['Press_Start_2P',monospace] text-[10px]">
                        <i className="nes-icon is-small coin scale-75" />
                        <span>{item.price}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`¿Canjear "${item.name}" por ${item.price} monedas?`)}
                        className="px-2.5 py-1 rounded bg-success/15 border border-success text-success text-xs font-bold hover:bg-success/25 cursor-pointer"
                      >
                        Canjear
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CHAT DE COHORTE */}
          {activeTab === 'chat' && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-brand flex items-center gap-2">
                  <PixelChat className="w-5 h-5" /> CHAT DE COHORTE: PROGRAMACIÓN IV
                </h2>
                <p className="text-xs text-ink-soft mt-1">Canal público con docentes y compañeros de cursada.</p>
              </div>

              <div className="bg-surface border border-surface-2 rounded flex flex-col h-[480px]">
                <div className="p-3 bg-canvas/80 border-b border-surface-2 flex items-center justify-between">
                  <span className="text-xs text-ink-soft font-bold"># general-programacion-4</span>
                  <span className="text-[10px] text-ink-soft">34 Alumnos conectados</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                  {chatMessages.map((m) => (
                    <div key={m.id} className={`flex flex-col max-w-[85%] ${m.isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[10px] font-bold ${m.isTeacher ? 'text-gold' : m.isMe ? 'text-brand-2' : 'text-ink-soft'}`}>
                          {m.user} {m.isTeacher && '• [Docente]'}
                        </span>
                        <span className="text-[9px] text-ink-soft">{m.time}</span>
                      </div>
                      <div className={`p-2.5 rounded text-xs leading-relaxed ${
                        m.isMe
                          ? 'bg-brand-2/20 border border-brand-2/60 text-brand-2'
                          : m.isTeacher
                          ? 'bg-gold/40 border border-gold/40 text-gold'
                          : 'bg-canvas border border-surface-2 text-ink'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="p-3 bg-canvas border-t border-surface-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Escribí un mensaje a la cohorte..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-surface border border-line rounded py-2 px-3 text-xs text-ink focus:outline-none focus:border-brand font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-brand hover:bg-brand text-white font-bold text-xs rounded transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>ENVIAR</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: PERFIL DE CURSO CON INFORMACIÓN GENERAL E HISTORIAL */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-brand flex items-center gap-2">
                  <PixelUser className="w-5 h-5" /> PERFIL DEL ESTUDIANTE
                </h2>
                <p className="text-xs text-ink-soft mt-1">Información de cuenta e historial cronológico de actividades.</p>
              </div>

              {/* 1. INFORMACIÓN GENERAL */}
              <div className="p-5 rounded border border-surface-2 bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded bg-brand/15 border-2 border-brand flex items-center justify-center text-3xl shadow-[0_0_10px_rgba(129,140,248,0.3)]">
                    👩‍💻
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-ink">Tamara Alvarez</h3>
                    <p className="text-xs text-ink-soft">Legajo: 412349 • Tecnicatura Universitaria en Programación</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-['Press_Start_2P',monospace] bg-brand/15 border border-brand/50 text-brand px-2 py-0.5 rounded">
                        Nivel 12
                      </span>
                      <span className="text-[10px] text-ink-soft font-mono">Progreso al Lvl 13: 82%</span>
                    </div>
                  </div>
                </div>

                {/* Badges de stats: XP, Monedas, Vidas */}
                <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
                  <div className="p-2.5 rounded bg-canvas border border-surface-2 text-center">
                    <span className="text-[10px] text-ink-soft block font-mono">XP Total</span>
                    <span className="font-['Press_Start_2P',monospace] text-xs text-brand-2">9,850</span>
                  </div>
                  <div className="p-2.5 rounded bg-canvas border border-surface-2 text-center">
                    <span className="text-[10px] text-ink-soft block font-mono">Monedas</span>
                    <span className="font-['Press_Start_2P',monospace] text-xs text-gold flex items-center justify-center gap-1">
                      <i className="nes-icon is-small coin scale-75" />
                      450
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-canvas border border-surface-2 text-center">
                    <span className="text-[10px] text-ink-soft block font-mono">Vidas</span>
                    <span className="font-['Press_Start_2P',monospace] text-xs text-danger flex items-center justify-center gap-1">
                      <i className="nes-icon is-small heart scale-75" />
                      5
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. HISTORIAL DE ACTIVIDADES REALIZADAS (Todos los cursos) */}
              <div className="bg-surface border border-surface-2 rounded p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-surface-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-2" />
                    <h3 className="font-['Press_Start_2P',monospace] text-xs text-ink">
                      HISTORIAL DE ACTIVIDADES (TODOS LOS CURSOS)
                    </h3>
                  </div>
                  <span className="text-[10px] text-ink-soft font-mono">Últimas 5 acciones</span>
                </div>

                <div className="divide-y divide-surface-2">
                  {activityHistory.map((act) => (
                    <div key={act.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-ink">{act.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-canvas border border-surface-2 px-1.5 py-0.5 rounded text-brand-2 font-mono">
                              {act.course}
                            </span>
                            <span className="text-[10px] text-ink-soft font-mono">{act.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {act.xp && (
                          <span className="font-['Press_Start_2P',monospace] text-[9px] text-brand-2 bg-brand-2/60 border border-brand-2/40 px-2 py-0.5 rounded">
                            {act.xp}
                          </span>
                        )}
                        {act.coins && (
                          <span className="font-['Press_Start_2P',monospace] text-[9px] text-gold bg-gold/60 border border-gold/40 px-2 py-0.5 rounded flex items-center gap-1">
                            <i className="nes-icon is-small coin scale-75" />
                            {act.coins}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Lector in-app: obliga a hacer scroll hasta el final antes de poder marcar como leído */}
      {readerItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm">
          <ArcadeCard
            variant="green"
            className="w-full max-w-2xl p-0 bg-surface flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-surface-2 shrink-0">
              <div className="min-w-0">
                <h3 className="font-['Press_Start_2P',monospace] text-xs text-success truncate">
                  {readerItem.title}
                </h3>
                <p className="text-[11px] text-ink-soft mt-1">{readerItem.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setReaderItem(null)}
                className="p-1 text-ink-soft hover:text-ink cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onScroll={handleReaderScroll}
              className="flex-1 overflow-y-auto p-5 text-xs text-ink-soft leading-relaxed whitespace-pre-line"
            >
              {readerItem.longContent}
              <div className="text-center text-[10px] text-line pt-4">— fin del documento —</div>
            </div>

            <div className="p-4 border-t border-surface-2 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[10px] text-ink-soft">
                {reachedEnd ? 'Llegaste al final. Ya podés marcarlo como hecho.' : 'Hacé scroll hasta el final para poder marcarlo como hecho.'}
              </span>
              <button
                type="button"
                disabled={!reachedEnd}
                onClick={confirmReaderRead}
                className={`px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  reachedEnd
                    ? 'bg-success hover:bg-success text-white cursor-pointer'
                    : 'bg-surface-2 text-ink-soft cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Marcar como hecha</span>
              </button>
            </div>
          </ArcadeCard>
        </div>
      )}
    </div>
  );
};

