import React, { useState } from 'react';
import {
  ArcadeNavbar,
  Breadcrumb,
  ArcadeCard,
  ArcadeButton,
  ArcadeBadge,
  ArcadeInput,
  ArcadeModal,
  ArcadeTabs,
  ArcadeTable,
  ArcadePagination,
  ArcadeAvatar,
  ArcadeProgressBar,
  ArcadeEmptyState,
  ArcadeTooltip,
  ArcadeSpinner,
  Callout,
  CodeBlock,
  MathBlock,
  LessonHeader,
  LessonStepper,
  CourseOutline,
  CountdownTimer,
  MultipleChoice,
  RubricPanel,
  StarRating,
  ActivityStatusBadge,
  ActivityKindBadge,
  GradeBadge,
  XPBar,
  LivesIndicator,
  CoinCounter,
  StreakFlame,
  LevelBadge,
  BadgeShowcase,
  PixelTrophy,
  PixelChest,
  PixelChat,
  PixelUser,
  PixelPdf,
  PixelVideo,
  PixelAudio,
  PixelLink,
  PixelScroll,
  PixelQuiz,
  PixelCoin,
  PixelMedal,
} from 'tup-arcade-ui';
import type {
  ActivityKind,
  ActivityStatus,
  ArcadeTableColumn,
  ChoiceOption,
  CourseOutlineNode,
  EarnedBadge,
  ResourceType,
  RubricCriterion,
} from 'tup-arcade-ui';
import {
  Map,
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
} from 'lucide-react';

export type SidebarTab = 'roadmap' | 'ranking' | 'shop' | 'chat' | 'profile';
export type UnitCategory = 'theoretical' | 'audiovisual' | 'support' | 'challenges';

/**
 * A long-form resource is authored as blocks so the reader can render prose,
 * runnable snippets, formulas and pedagogical asides with the right component
 * instead of dumping everything into one pre-formatted string.
 */
export type ContentBlock =
  | { kind: 'text'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'code'; code: string; language?: string; filename?: string }
  | { kind: 'math'; expression: string }
  | { kind: 'callout'; variant: 'note' | 'warning' | 'tip' | 'citation'; title?: string; text: string; source?: string };

export interface QuizQuestion {
  id: string;
  question: string;
  options: ChoiceOption[];
  correctIds: string[];
  multiple?: boolean;
}

export interface ResourceItem {
  id: string;
  type: 'pdf' | 'video' | 'audio' | 'link' | 'text' | 'challenge';
  title: string;
  durationOrSize?: string;
  completed?: boolean;
  xp?: number;
  description?: string;
  kind?: ActivityKind;
  estimatedMinutes?: number;
  /** Si tiene bloques, el material se lee dentro de la plataforma y hay que
   * hacer scroll hasta el final para poder marcarlo como leído. */
  blocks?: ContentBlock[];
  /** Desafíos con cuestionario: se resuelven en el modal de batalla. */
  quiz?: QuizQuestion[];
  quizSeconds?: number;
  rubric?: RubricCriterion[];
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

const RANKING_PAGE_SIZE = 5;

const activityStatusLabels: Partial<Record<ActivityStatus, string>> = {
  pending: 'Pendiente',
  in_progress: 'En curso',
  submitted: 'Entregado',
  graded: 'Corregido',
  completed: 'Completado',
  overdue: 'Vencido',
  locked: 'Bloqueado',
};

const activityKindLabels: Partial<Record<ActivityKind, string>> = {
  required: 'Obligatorio',
  optional: 'Opcional',
  formative: 'Formativo',
  summative: 'Sumativo',
  peer: 'Entre pares',
};

const resourceTypeToKind: Record<ResourceItem['type'], ResourceType | 'quiz'> = {
  pdf: 'document',
  video: 'video',
  audio: 'audio',
  link: 'link',
  text: 'page',
  challenge: 'quiz',
};

const resourceIcon = (type: ResourceItem['type']) => {
  switch (type) {
    case 'pdf':
      return <PixelPdf className="w-4 h-4" />;
    case 'video':
      return <PixelVideo className="w-4 h-4" />;
    case 'audio':
      return <PixelAudio className="w-4 h-4" />;
    case 'link':
      return <PixelLink className="w-4 h-4" />;
    case 'challenge':
      return <PixelQuiz className="w-4 h-4" />;
    case 'text':
    default:
      return <PixelScroll className="w-4 h-4" />;
  }
};

/** Resources played in the built-in media modal rather than downloaded. */
const isPlayable = (type: ResourceItem['type']) => type === 'video' || type === 'audio';

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
          { id: 't1', type: 'pdf', title: 'TUP_PIV_FE_TEO_U1_ARQUITECTURA_DESPLIEGUE.pdf', durationOrSize: '2.4 MB', completed: true, kind: 'required', estimatedMinutes: 45, description: 'Microfrontends, Webpack Module Federation y despliegues modernos.' },
          { id: 't2', type: 'pdf', title: 'TUP_PIV_BE_PROPUESTA_ARQ.pdf', durationOrSize: '1.8 MB', completed: true, kind: 'required', estimatedMinutes: 30, description: 'Arquitectura hexagonal en C# y Clean Architecture.' },
        ],
        audiovisual: [
          { id: 'v1', type: 'video', title: 'Masterclass: Despliegue de Single Page Apps en Vercel & Docker', durationOrSize: '42 min', completed: true, kind: 'optional', estimatedMinutes: 42, description: 'Video explicativo paso a paso con terminal en vivo.' },
          { id: 'v2', type: 'video', title: 'Patrón Adapter y Ports en Backend .NET', durationOrSize: '28 min', completed: true, kind: 'optional', estimatedMinutes: 28, description: 'Demostración práctica de desacoplamiento.' },
          { id: 'v5', type: 'audio', title: 'Repaso en audio: glosario de arquitectura', durationOrSize: '18 min', completed: false, kind: 'optional', estimatedMinutes: 18, description: 'Versión escuchable del glosario, pensada para repasar en el colectivo.' },
        ],
        supportMaterial: [
          {
            id: 's1',
            type: 'text',
            title: 'Guía de Comandos Docker y CI/CD GitHub Actions',
            durationOrSize: 'Cheat Sheet',
            completed: true,
            kind: 'required',
            estimatedMinutes: 25,
            description: 'Comandos esenciales y snippets yaml listos para copiar.',
            blocks: [
              {
                kind: 'text',
                text: 'Esta guía resume los comandos que vas a usar todo el cuatrimestre para levantar, depurar y desplegar los contenedores de la cátedra.',
              },
              { kind: 'heading', text: '1. Comandos básicos de Docker' },
              {
                kind: 'code',
                language: 'bash',
                filename: 'docker-basics.sh',
                code: [
                  '# construye una imagen a partir del Dockerfile del directorio actual',
                  'docker build -t mi-imagen:1.0 .',
                  '',
                  '# corre el contenedor y mapea el puerto 3000 del host al del contenedor',
                  'docker run -p 3000:3000 mi-imagen:1.0',
                  '',
                  '# lista los contenedores corriendo (-a incluye los detenidos)',
                  'docker ps -a',
                  '',
                  '# sigue los logs en vivo, clave para debuggear un healthcheck que falla',
                  'docker logs -f mi-contenedor',
                ].join('\n'),
              },
              { kind: 'heading', text: '2. Multi-stage builds' },
              {
                kind: 'text',
                text: 'La clave para bajar el tamaño final de la imagen es separar la etapa de build de la etapa de runtime. En la primera instalás dependencias y compilás; en la segunda copiás solo el resultado (dist/ o build/) a una imagen liviana como nginx:alpine. Esto es exactamente lo que se evalúa en el Desafío 1.',
              },
              {
                kind: 'callout',
                variant: 'tip',
                title: 'Regla práctica',
                text: 'Si la imagen final supera los 30 MB, casi siempre es porque quedaron las dependencias de desarrollo dentro de la etapa de runtime.',
              },
              { kind: 'heading', text: '3. Docker Compose para desarrollo' },
              {
                kind: 'code',
                language: 'yaml',
                filename: 'docker-compose.yml',
                code: [
                  'version: "3.9"',
                  'services:',
                  '  frontend:',
                  '    build: ./frontend',
                  '    ports: ["5173:5173"]',
                  '  backend:',
                  '    build: ./backend',
                  '    environment:',
                  '      - DB_HOST=postgres',
                  '    depends_on: [postgres]',
                  '  postgres:',
                  '    image: postgres:16',
                  '    environment:',
                  '      - POSTGRES_PASSWORD=devpass',
                ].join('\n'),
              },
              {
                kind: 'callout',
                variant: 'warning',
                title: 'Nunca commitees el .env',
                text: 'Con un solo docker compose up levantás los tres servicios. Las contraseñas reales van en variables de entorno del runner, jamás en el repositorio.',
              },
              { kind: 'heading', text: '4. Reverse proxy con Nginx' },
              {
                kind: 'text',
                text: 'El Boss Fight de la Unidad 1 pide un nginx.conf que redirija /api hacia el backend y sirva el build del frontend en la raíz.',
              },
              {
                kind: 'code',
                language: 'nginx',
                filename: 'nginx.conf',
                code: [
                  'location /api/ {',
                  '  proxy_pass http://backend:8080/;',
                  '}',
                  '',
                  'location / {',
                  '  try_files $uri /index.html;',
                  '}',
                ].join('\n'),
              },
              { kind: 'heading', text: '5. Pipeline de GitHub Actions' },
              {
                kind: 'code',
                language: 'yaml',
                filename: '.github/workflows/ci.yml',
                code: [
                  'name: CI',
                  'on: [push]',
                  'jobs:',
                  '  build:',
                  '    runs-on: ubuntu-latest',
                  '    steps:',
                  '      - uses: actions/checkout@v4',
                  '      - run: npm ci',
                  '      - run: npm run lint',
                  '      - run: npm test',
                  '      - run: docker build -t app:latest .',
                ].join('\n'),
              },
              { kind: 'heading', text: '6. Costo de las capas' },
              {
                kind: 'text',
                text: 'El tiempo total del build crece con la cantidad de capas invalidadas en cada push. Si n es la cantidad de capas y k la primera capa que cambió, el trabajo rehecho es:',
              },
              { kind: 'math', expression: 'T_{build} = \\sum_{i=k}^{n} t_i' },
              {
                kind: 'text',
                text: 'Por eso conviene poner las instrucciones que cambian poco (instalación de dependencias) antes de las que cambian en cada commit (copiar el código fuente).',
              },
              {
                kind: 'callout',
                variant: 'note',
                title: 'Errores comunes',
                text: 'Si el healthcheck nunca pasa a "healthy", revisá que el puerto expuesto coincida con el que escucha la app adentro del contenedor, no el del host. Si el build tarda demasiado, revisá que el .dockerignore excluya node_modules.',
              },
              {
                kind: 'callout',
                variant: 'citation',
                title: 'Lectura recomendada',
                text: 'Las buenas prácticas de construcción de imágenes están documentadas oficialmente y se actualizan en cada release mayor.',
                source: 'Docker Inc. (2025). Best practices for writing Dockerfiles. Docker Documentation.',
              },
            ],
          },
          { id: 's2', type: 'link', title: 'Repositorio Template de Microfrontends (GitHub)', durationOrSize: 'Enlace Web', completed: true, kind: 'optional', description: 'Repo base para clonar y comenzar los desafíos de cátedra.' },
        ],
        challenges: [
          {
            id: 'c1',
            type: 'challenge',
            title: 'Desafío 1: Configurar Dockerfile multi-stage',
            durationOrSize: '+200 XP',
            completed: true,
            xp: 200,
            kind: 'summative',
            quizSeconds: 300,
            description: 'Compilar y empaquetar una app Vite en Nginx con menos de 30MB.',
            quiz: [
              {
                id: 'q1',
                question: '¿Cuál es el objetivo principal de un build multi-stage?',
                options: [
                  { id: 'a', label: 'Reducir el tamaño de la imagen final dejando afuera las herramientas de build', feedback: 'Exacto: la etapa de runtime solo recibe el artefacto compilado.' },
                  { id: 'b', label: 'Ejecutar varios contenedores a la vez', feedback: 'Eso es orquestación, trabajo de Compose o Kubernetes.' },
                  { id: 'c', label: 'Compilar el código más rápido', feedback: 'El tiempo de compilación no cambia; lo que cambia es el tamaño final.' },
                ],
                correctIds: ['a'],
              },
              {
                id: 'q2',
                question: '¿Qué instrucciones conviene ubicar arriba en el Dockerfile? (elegí todas las correctas)',
                multiple: true,
                options: [
                  { id: 'a', label: 'La instalación de dependencias', feedback: 'Sí: cambia poco, así que la capa se reutiliza entre builds.' },
                  { id: 'b', label: 'La copia del código fuente', feedback: 'No: cambia en cada commit e invalida todo lo que viene después.' },
                  { id: 'c', label: 'La imagen base', feedback: 'Sí: es lo primero y lo más estable.' },
                ],
                correctIds: ['a', 'c'],
              },
            ],
            rubric: [
              { id: 'r1', label: 'Imagen final por debajo de 30 MB', weight: 40, score: 9, maxScore: 10 },
              { id: 'r2', label: 'Separación correcta de etapas', weight: 35, score: 10, maxScore: 10 },
              { id: 'r3', label: 'Uso de .dockerignore', weight: 25, score: 7, maxScore: 10, comment: 'Faltó excluir la carpeta de coverage.' },
            ],
          },
          {
            id: 'c2',
            type: 'challenge',
            title: 'Boss Fight: Healthcheck & Reverse Proxy Nginx',
            durationOrSize: '+400 XP',
            completed: true,
            xp: 400,
            kind: 'summative',
            quizSeconds: 420,
            description: 'Configurar ruteo entre contenedor frontend y backend.',
            quiz: [
              {
                id: 'q1',
                question: 'El healthcheck nunca pasa a "healthy". ¿Qué revisás primero?',
                options: [
                  { id: 'a', label: 'Que el puerto del healthcheck sea el que escucha la app dentro del contenedor', feedback: 'Correcto: el puerto del host no aplica dentro de la red del contenedor.' },
                  { id: 'b', label: 'Que el host tenga Docker actualizado', feedback: 'Rara vez es la causa de un healthcheck que falla siempre.' },
                  { id: 'c', label: 'Que la imagen base sea alpine', feedback: 'La distribución base no determina el resultado del healthcheck.' },
                ],
                correctIds: ['a'],
              },
            ],
            rubric: [
              { id: 'r1', label: 'Proxy /api funcionando', weight: 50, score: 10, maxScore: 10 },
              { id: 'r2', label: 'Fallback de SPA en /', weight: 30, score: 10, maxScore: 10 },
              { id: 'r3', label: 'Healthcheck declarado', weight: 20, score: 8, maxScore: 10 },
            ],
          },
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
          { id: 't3', type: 'pdf', title: 'TUP_PIV_FE_TEO_U2_COMPONENT_DRIVEN.pdf', durationOrSize: '3.1 MB', completed: true, kind: 'required', estimatedMinutes: 50, description: 'Metodología Atomic Design aplicada a interfaces interactivas.' },
        ],
        audiovisual: [
          { id: 'v3', type: 'video', title: 'Construyendo un Design System Pixel-Art con Tailwind', durationOrSize: '35 min', completed: true, kind: 'optional', estimatedMinutes: 35, description: 'Técnicas de sombreado beveled y fuentes monospace.' },
        ],
        supportMaterial: [
          { id: 's3', type: 'link', title: 'Documentación interactiva NES.css y Sprites', durationOrSize: 'Enlace Web', completed: false, kind: 'optional', description: 'Catálogo de iconos e inputs estilo retro gaming.' },
        ],
        challenges: [
          {
            id: 'c3',
            type: 'challenge',
            title: 'Desafío 2: Crear ArcadeCard reutilizable',
            durationOrSize: '+250 XP',
            completed: false,
            xp: 250,
            kind: 'formative',
            quizSeconds: 240,
            description: 'Implementar props variant y esquinas pixeladas.',
            quiz: [
              {
                id: 'q1',
                question: '¿Por qué un componente de librería debe recibir su variante por prop en lugar de leerla de un contexto global?',
                options: [
                  { id: 'a', label: 'Porque lo vuelve predecible y testeable de forma aislada', feedback: 'Exacto: la misma entrada produce siempre la misma salida.' },
                  { id: 'b', label: 'Porque el contexto es más lento', feedback: 'El rendimiento no es el problema acá; el acoplamiento sí.' },
                  { id: 'c', label: 'Porque React no permite contextos en librerías', feedback: 'Sí los permite; la cuestión es de diseño, no técnica.' },
                ],
                correctIds: ['a'],
              },
            ],
            rubric: [
              { id: 'r1', label: 'API de props clara', weight: 50, score: 0, maxScore: 10 },
              { id: 'r2', label: 'Cobertura de variantes', weight: 50, score: 0, maxScore: 10 },
            ],
          },
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
          { id: 't4', type: 'pdf', title: 'TUP_PIV_FE_TEO_U3_ESTADO_REACTIVO.pdf', durationOrSize: '2.0 MB', completed: false, kind: 'required', estimatedMinutes: 40, description: 'Context API vs Zustand vs Redux Toolkit.' },
        ],
        audiovisual: [
          { id: 'v4', type: 'video', title: 'Gestión de Sesión con Refresh Tokens y Axios Interceptors', durationOrSize: '50 min', completed: false, kind: 'optional', estimatedMinutes: 50, description: 'Manejo seguro de credenciales en navegador.' },
        ],
        supportMaterial: [
          { id: 's4', type: 'text', title: 'Diagrama de Flujo de Autenticación', durationOrSize: 'PDF 1 pág', completed: false, kind: 'optional', description: 'Secuencia completa Alumno -> Auth Server -> Gateway.' },
        ],
        challenges: [
          { id: 'c4', type: 'challenge', title: 'Desafío 3: Proteger Rutas con AuthGuard', durationOrSize: '+300 XP', completed: false, xp: 300, kind: 'summative', description: 'Redirigir a /login si no hay token válido.' },
        ]
      }
    },
  ];

  // Estado de "hecho" de material teórico y de apoyo. Arranca siempre en "no visto".
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});

  // Material extenso abierto en el lector in-app (requiere scroll hasta el final)
  const [readerItem, setReaderItem] = useState<ResourceItem | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [readerRating, setReaderRating] = useState(0);

  // Reproductor de video
  const [videoItem, setVideoItem] = useState<ResourceItem | null>(null);

  // Desafío interactivo
  const [battleItem, setBattleItem] = useState<ResourceItem | null>(null);
  const [battleAnswers, setBattleAnswers] = useState<Record<string, string[]>>({});
  const [battleGraded, setBattleGraded] = useState(false);
  const [battleTimedOut, setBattleTimedOut] = useState(false);

  // Canje en el mercado
  const [shopItem, setShopItem] = useState<{ id: string; name: string; price: number } | null>(null);

  const [rankingPage, setRankingPage] = useState(1);
  const [rankingSortKey, setRankingSortKey] = useState('rank');
  const [rankingSortDirection, setRankingSortDirection] = useState<'asc' | 'desc'>('asc');

  const statusOf = (item: ResourceItem): ActivityStatus => {
    if (readMap[item.id]) return 'completed';
    if (item.completed) return 'graded';
    return 'pending';
  };

  const handleOpenResource = (item: ResourceItem) => {
    if (item.blocks) {
      setReachedEnd(false);
      setReaderRating(0);
      setReaderItem(item);
      return;
    }
    if (isPlayable(item.type)) {
      setVideoItem(item);
      return;
    }
    setReadMap((prev) => ({ ...prev, [item.id]: true }));
  };

  const handleToggleRead = (item: ResourceItem) => {
    // Si es un texto extenso, la única forma de marcarlo leído es llegando al final del lector.
    if (item.blocks && !readMap[item.id]) {
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

  const openBattle = (item: ResourceItem) => {
    setBattleAnswers({});
    setBattleGraded(false);
    setBattleTimedOut(false);
    setBattleItem(item);
  };

  const battleScore = () => {
    const questions = battleItem?.quiz ?? [];
    if (questions.length === 0) return 0;
    const correct = questions.filter((q) => {
      const given = [...(battleAnswers[q.id] ?? [])].sort();
      const expected = [...q.correctIds].sort();
      return given.length === expected.length && given.every((id, i) => id === expected[i]);
    }).length;
    return Math.round((correct / questions.length) * 10);
  };

  // Ranking data (Top 10 + current user)
  interface RankingRow {
    rank: number;
    name: string;
    xp: number;
    level: number;
    badge: string;
    isMe?: boolean;
  }

  const rankingList: RankingRow[] = [
    { rank: 1, name: 'Facundo Ramirez', xp: 14850, level: 16, badge: 'Archimago Dev' },
    { rank: 2, name: 'Sofia Rodriguez', xp: 13920, level: 15, badge: 'Hexagonal Knight' },
    { rank: 3, name: 'Lucas Benitez', xp: 12400, level: 14, badge: 'Docker Master' },
    { rank: 4, name: 'Mateo Lopez', xp: 11800, level: 14, badge: 'Frontend Guru' },
    { rank: 5, name: 'Valentina Díaz', xp: 11150, level: 13, badge: 'Fullstacker' },
    { rank: 6, name: 'Joaquin Perez', xp: 10800, level: 13, badge: 'Code Guardian' },
    { rank: 7, name: 'Camila Gomez', xp: 10250, level: 13, badge: 'Bug Hunter' },
    { rank: 8, name: 'Tamara (Tú)', xp: 9850, level: 12, isMe: true, badge: 'Retro Challenger' },
    { rank: 9, name: 'Nicolas Romero', xp: 9400, level: 12, badge: 'Unit Tester' },
    { rank: 10, name: 'Agustina Fernandez', xp: 9100, level: 11, badge: 'Clean Coder' },
  ];

  const sortedRanking = [...rankingList].sort((a, b) => {
    const factor = rankingSortDirection === 'asc' ? 1 : -1;
    if (rankingSortKey === 'name') return a.name.localeCompare(b.name) * factor;
    if (rankingSortKey === 'xp') return (a.xp - b.xp) * factor;
    if (rankingSortKey === 'level') return (a.level - b.level) * factor;
    return (a.rank - b.rank) * factor;
  });

  const rankingPageCount = Math.max(1, Math.ceil(sortedRanking.length / RANKING_PAGE_SIZE));
  const visibleRanking = sortedRanking.slice(
    (rankingPage - 1) * RANKING_PAGE_SIZE,
    rankingPage * RANKING_PAGE_SIZE,
  );

  const handleRankingSort = (key: string) => {
    if (key === rankingSortKey) {
      setRankingSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setRankingSortKey(key);
      setRankingSortDirection('asc');
    }
    setRankingPage(1);
  };

  const rankingColumns: ArcadeTableColumn<RankingRow>[] = [
    {
      key: 'rank',
      header: 'Pos',
      width: '4rem',
      sortable: true,
      render: (row) => (
        <span className="font-['Press_Start_2P',monospace] text-[10px] text-ink-soft">#{row.rank}</span>
      ),
    },
    {
      key: 'name',
      header: 'Alumno',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          <ArcadeAvatar
            name={row.name}
            size="xs"
            ring={row.isMe ? 'cyan' : row.rank <= 3 ? 'gold' : 'none'}
          />
          <span className="truncate">{row.name}</span>
          <ArcadeBadge tone="neutral" appearance="outline" size="sm" className="hidden sm:inline-flex">
            {row.badge}
          </ArcadeBadge>
        </div>
      ),
    },
    {
      key: 'level',
      header: 'Nivel',
      align: 'center',
      sortable: true,
      render: (row) => <span className="text-ink-soft font-mono">Lvl {row.level}</span>,
    },
    {
      key: 'xp',
      header: 'XP',
      align: 'right',
      sortable: true,
      render: (row) => (
        <span className="font-['Press_Start_2P',monospace] text-[10px] text-gold">
          {row.xp.toLocaleString()}
        </span>
      ),
    },
  ];

  // Mercado items
  const shopItems = [
    { id: 's1', name: 'Poción de Vida', desc: '+1 Vida extra para exámenes y desafíos.', price: 150, icon: <PixelMedal className="w-5 h-5" />, tag: 'CONSUMIBLE' },
    { id: 's2', name: 'Pista de Docente', desc: 'Desbloquea pista oficial en el próximo Boss Fight.', price: 300, icon: <Sparkles className="w-5 h-5 text-gold" />, tag: 'VENTAJA' },
    { id: 's3', name: 'Emblema "Pixel Master"', desc: 'Distintivo holográfico animado para tu perfil.', price: 500, icon: <Award className="w-5 h-5 text-brand-2" />, tag: 'COSMÉTICO' },
    { id: 's4', name: 'Escudo Anti-Falla', desc: 'Inmune a pérdida de racha por 48 hs.', price: 250, icon: <Shield className="w-5 h-5 text-success" />, tag: 'BUFF' },
    { id: 's5', name: 'Tema Retro Monocromo', desc: 'Skin estilo GameBoy original para la plataforma.', price: 400, icon: <Zap className="w-5 h-5 text-brand" />, tag: 'SKIN' },
    { id: 's6', name: 'Rol VIP en Discord', desc: 'Canal exclusivo con ayudantes de cátedra.', price: 600, icon: <Flame className="w-5 h-5 text-orange-400" />, tag: 'COMUNIDAD' },
  ];

  const coins = 450;

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
  interface HistoryRow {
    id: string;
    course: string;
    title: string;
    date: string;
    xp?: number;
    coins?: number;
  }

  const activityHistory: HistoryRow[] = [
    { id: 'a1', course: 'Programación IV', title: 'Completó Desafío: Dockerfile Multi-stage', date: 'Hoy, 02:40 AM', xp: 200, coins: 30 },
    { id: 'a2', course: 'Programación IV', title: 'Descargó Apunte: Arquitectura y Despliegue', date: 'Ayer, 18:15', xp: 25 },
    { id: 'a3', course: 'Base de Datos II', title: 'Aprobó Cuestionario: Índices B-Tree y Planes de Ejecución', date: 'Hace 3 días', xp: 350, coins: 50 },
    { id: 'a4', course: 'Base de Datos II', title: 'Desbloqueó Logro: "SQL Optimizer Lvl 2"', date: 'Hace 4 días', xp: 100 },
    { id: 'a5', course: 'Programación IV', title: 'Ingresó a la 2da Cohorte 2026', date: 'Hace 1 semana', xp: 50 },
  ];

  const historyColumns: ArcadeTableColumn<HistoryRow>[] = [
    {
      key: 'title',
      header: 'Actividad',
      render: (row) => <span className="text-xs font-bold text-ink">{row.title}</span>,
    },
    {
      key: 'course',
      header: 'Curso',
      render: (row) => (
        <ArcadeBadge tone="cyan" appearance="outline" size="sm">
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
            <ArcadeBadge tone="cyan" size="sm">+{row.xp} XP</ArcadeBadge>
          )}
          {row.coins !== undefined && (
            <ArcadeBadge tone="yellow" size="sm" icon={<PixelCoin className="w-3 h-3" />}>
              +{row.coins}
            </ArcadeBadge>
          )}
        </div>
      ),
    },
  ];

  const courseBadges: EarnedBadge[] = [
    { id: 'cb1', name: 'Docker Master', description: 'Superaste el Boss Fight de la Unidad 1.', earned: true },
    { id: 'cb2', name: 'Lector Compulsivo', description: 'Leíste todo el material de apoyo de una unidad.', earned: true },
    { id: 'cb3', name: 'Atomic Designer', description: 'Bloqueado: completá el Desafío 2.', earned: false },
    { id: 'cb4', name: 'Guardián de Rutas', description: 'Bloqueado: completá el Desafío 3.', earned: false },
  ];

  // Árbol de recursos de la unidad abierta, para el índice lateral.
  const outlineNodes: CourseOutlineNode[] = selectedUnit
    ? [
        {
          id: 'theoretical',
          label: 'Material Teórico',
          children: selectedUnit.resources.theoretical.map((r) => ({
            id: r.id,
            label: r.title,
            status: statusOf(r),
            kind: resourceTypeToKind[r.type],
          })),
        },
        {
          id: 'audiovisual',
          label: 'Recursos Audiovisuales',
          children: selectedUnit.resources.audiovisual.map((r) => ({
            id: r.id,
            label: r.title,
            status: statusOf(r),
            kind: resourceTypeToKind[r.type],
          })),
        },
        {
          id: 'support',
          label: 'Material de Apoyo',
          children: selectedUnit.resources.supportMaterial.map((r) => ({
            id: r.id,
            label: r.title,
            status: statusOf(r),
            kind: resourceTypeToKind[r.type],
          })),
        },
        {
          id: 'challenges',
          label: 'Desafíos',
          children: selectedUnit.resources.challenges.map((r) => ({
            id: r.id,
            label: r.title,
            status: statusOf(r),
            kind: resourceTypeToKind[r.type],
          })),
        },
      ]
    : [];

  const allUnitResources = selectedUnit
    ? [
        ...selectedUnit.resources.theoretical,
        ...selectedUnit.resources.audiovisual,
        ...selectedUnit.resources.supportMaterial,
        ...selectedUnit.resources.challenges,
      ]
    : [];

  const categoryTitles: Record<UnitCategory, string> = {
    theoretical: 'MATERIAL TEÓRICO (PDF / DOCUMENTOS)',
    audiovisual: 'RECURSOS AUDIOVISUALES (VIDEOS / CLASES)',
    support: 'MATERIAL DE APOYO (REPOSITORIOS / GUÍAS)',
    challenges: 'DESAFÍOS & BOSS FIGHTS (CUESTIONARIOS / CÓDIGO)',
  };

  const resourcesFor = (category: UnitCategory): ResourceItem[] => {
    if (!selectedUnit) return [];
    switch (category) {
      case 'theoretical':
        return selectedUnit.resources.theoretical;
      case 'audiovisual':
        return selectedUnit.resources.audiovisual;
      case 'support':
        return selectedUnit.resources.supportMaterial;
      case 'challenges':
      default:
        return selectedUnit.resources.challenges;
    }
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.kind) {
      case 'heading':
        return (
          <h4 key={index} className="font-['Press_Start_2P',monospace] text-[11px] text-success mt-2">
            {block.text}
          </h4>
        );
      case 'code':
        return (
          <CodeBlock
            key={index}
            code={block.code}
            language={block.language}
            filename={block.filename}
            showLineNumbers
          />
        );
      case 'math':
        return <MathBlock key={index} expression={block.expression} display="block" />;
      case 'callout':
        return (
          <Callout key={index} variant={block.variant} title={block.title} source={block.source}>
            {block.text}
          </Callout>
        );
      case 'text':
      default:
        return (
          <p key={index} className="text-xs text-ink-soft leading-relaxed">
            {block.text}
          </p>
        );
    }
  };

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
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ArcadeTooltip content="Volver a Mis Cursos">
              <ArcadeButton variant="cyan" size="sm" onClick={onBackToCourses} aria-label="Volver a Mis Cursos">
                <ArrowLeft className="w-4 h-4" />
              </ArcadeButton>
            </ArcadeTooltip>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Press_Start_2P',monospace] text-xs text-brand-2">
                  Programación IV
                </span>
                <ArcadeBadge tone="cyan" appearance="outline" size="sm">
                  MODO SPEEDRUN
                </ArcadeBadge>
              </div>
              <p className="text-[11px] text-ink-soft">2da Cohorte 2026 • Cátedra TUP</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <XPBar currentXP={850} levelXP={1000} level={12} className="hidden md:block w-48" />
            <StreakFlame days={9} />
            <LivesIndicator lives={5} />
            <CoinCounter coins={coins} />
          </div>
        </div>
      </div>

      {/* Layout Sidebar + Contenido */}
      <div className="w-full px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Lateral */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          {selectedUnit ? (
            <ArcadeCard variant="cyan" className="flex flex-col gap-3">
              <ArcadeButton variant="cyan" size="sm" onClick={() => setSelectedUnit(null)}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al Roadmap</span>
              </ArcadeButton>

              <div className="px-1 py-1 border-b border-surface-2">
                <p className="font-['Press_Start_2P',monospace] text-[10px] text-brand-2 truncate">
                  {selectedUnit.name}: {selectedUnit.title.split(':')[1] || selectedUnit.title}
                </p>
                <p className="text-[10px] text-ink-soft mt-1">Índice de la unidad:</p>
              </div>

              <CourseOutline
                nodes={outlineNodes}
                activeId={activeCategory}
                iconFor={(node) => {
                  const resource = allUnitResources.find((r) => r.id === node.id);
                  return resource ? resourceIcon(resource.type) : undefined;
                }}
                onSelect={(node) => {
                  const parent = outlineNodes.find((section) =>
                    section.children?.some((child) => child.id === node.id),
                  );
                  const category = (parent?.id ?? node.id) as UnitCategory;
                  setActiveCategory(category);
                  const resource = allUnitResources.find((r) => r.id === node.id);
                  if (resource) handleOpenResource(resource);
                }}
              />
            </ArcadeCard>
          ) : (
            <ArcadeCard variant="default" className="flex flex-col gap-3">
              <span className="font-['Press_Start_2P',monospace] text-[10px] text-ink-soft px-1">
                PROGRESO DEL CURSO
              </span>
              <LessonStepper
                orientation="vertical"
                steps={units.map((u) => ({ id: u.id, label: u.title, locked: u.progress === 0 }))}
                currentIndex={units.findIndex((u) => u.progress < 100)}
                onStepClick={(step) => {
                  const unit = units.find((u) => u.id === step.id);
                  if (unit) {
                    setSelectedUnit(unit);
                    setActiveCategory('theoretical');
                  }
                }}
              />
            </ArcadeCard>
          )}
        </aside>

        {/* Área Central Principal */}
        <main className="lg:col-span-9 flex flex-col gap-6">
          <ArcadeTabs
            activeId={activeTab}
            onChange={(id) => {
              setActiveTab(id as SidebarTab);
              if (id !== 'roadmap') setSelectedUnit(null);
            }}
            tabs={[
              { id: 'roadmap', label: 'Roadmap', icon: <Map className="w-4 h-4" /> },
              { id: 'ranking', label: 'Ranking', icon: <PixelTrophy className="w-4 h-4" /> },
              { id: 'shop', label: 'Mercado', icon: <PixelChest className="w-4 h-4" /> },
              { id: 'chat', label: 'Chat', icon: <PixelChat className="w-4 h-4" />, badge: chatMessages.length },
              { id: 'profile', label: 'Perfil', icon: <PixelUser className="w-4 h-4" /> },
            ]}
          />

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
                  <ArcadeCard
                    key={u.id}
                    variant="default"
                    onClick={() => { setSelectedUnit(u); setActiveCategory('theoretical'); }}
                    className="hover:border-brand-2 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 shrink-0 rounded bg-canvas border border-brand-2/60 group-hover:border-brand-2 flex items-center justify-center font-['Press_Start_2P',monospace] text-xs text-brand-2">
                        {u.name}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-ink group-hover:text-brand-2 transition-colors">
                          {u.title}
                        </h3>
                        <p className="text-xs text-ink-soft mt-0.5 line-clamp-1">{u.description}</p>
                        <div className="mt-2 max-w-xs">
                          <ArcadeProgressBar value={u.progress} max={100} tone="cyan" size="sm" showValue />
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 shrink-0 text-brand-2 group-hover:translate-x-1 transition-transform" />
                  </ArcadeCard>
                ))}
              </div>
            </div>
          )}

          {/* DETALLE DE UNIDAD SELECCIONADA */}
          {activeTab === 'roadmap' && selectedUnit && (
            <div className="flex flex-col gap-4">
              <ArcadeCard variant="cyan">
                <LessonHeader
                  title={selectedUnit.title}
                  section={`Programación IV > ${selectedUnit.name}`}
                  status={selectedUnit.progress === 100 ? 'completed' : 'in_progress'}
                  statusLabels={activityStatusLabels}
                  actions={
                    <div className="w-40">
                      <ArcadeProgressBar value={selectedUnit.progress} max={100} tone="cyan" size="sm" showValue />
                    </div>
                  }
                />
                <p className="text-xs text-ink-soft mt-2">{selectedUnit.description}</p>
              </ArcadeCard>

              {/* Lista de Contenidos de la sección activa */}
              <ArcadeCard variant="default" className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-surface-2">
                  <h3 className="font-['Press_Start_2P',monospace] text-xs text-brand-2">
                    {categoryTitles[activeCategory]}
                  </h3>
                </div>

                <div className="flex flex-col gap-2.5">
                  {resourcesFor(activeCategory).length === 0 ? (
                    <ArcadeEmptyState
                      title="Esta sección todavía no tiene contenido"
                      description="La cátedra publica el material a medida que avanza la cursada."
                      icon={<PixelScroll className="w-10 h-10" />}
                    />
                  ) : (
                    resourcesFor(activeCategory).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-canvas border border-surface-2 rounded flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="shrink-0 mt-0.5">{resourceIcon(item.type)}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-ink">{item.title}</p>
                            <p className="text-[11px] text-ink-soft mt-0.5">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-[10px] text-ink-soft font-mono">{item.durationOrSize}</span>
                              <ActivityStatusBadge
                                status={statusOf(item)}
                                labels={activityStatusLabels}
                                size="sm"
                              />
                              {item.kind && (
                                <ActivityKindBadge kind={item.kind} labels={activityKindLabels} size="sm" />
                              )}
                              {item.blocks && (
                                <ArcadeBadge tone="green" appearance="outline" size="sm">
                                  LECTURA COMPLETA REQUERIDA
                                </ArcadeBadge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.type === 'challenge' ? (
                            <ArcadeButton
                              variant="magenta"
                              size="sm"
                              disabled={!item.quiz}
                              onClick={() => openBattle(item)}
                            >
                              <Swords className="w-3.5 h-3.5" />
                              <span>Batallar</span>
                            </ArcadeButton>
                          ) : (
                            <>
                              <ArcadeButton
                                variant={readMap[item.id] ? 'green' : 'cyan'}
                                size="sm"
                                onClick={() => handleToggleRead(item)}
                              >
                                <span>{readMap[item.id] ? 'Hecho' : 'Marcar como Hecho'}</span>
                              </ArcadeButton>
                              <ArcadeButton variant="yellow" size="sm" onClick={() => handleOpenResource(item)}>
                                {isPlayable(item.type) || item.type === 'link' ? (
                                  <ExternalLink className="w-3.5 h-3.5" />
                                ) : item.blocks ? (
                                  <BookOpen className="w-3.5 h-3.5" />
                                ) : (
                                  <Download className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {isPlayable(item.type)
                                    ? 'Reproducir'
                                    : item.type === 'link'
                                    ? 'Explorar'
                                    : item.blocks
                                    ? 'Leer'
                                    : 'Abrir'}
                                </span>
                              </ArcadeButton>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ArcadeCard>
            </div>
          )}

          {/* TAB 2: RANKING (Podio Top 3 + Tabla paginada) */}
          {activeTab === 'ranking' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-gold flex items-center gap-2">
                  <PixelTrophy className="w-5 h-5" /> LEADERBOARD DE COHORTE
                </h2>
                <p className="text-xs text-ink-soft mt-1">Los estudiantes más destacados por XP acumulado en desafíos.</p>
              </div>

              {/* PODIO TOP 3 */}
              <div className="grid grid-cols-3 gap-3 items-end pt-8 pb-2">
                {[1, 0, 2].map((index) => {
                  const player = rankingList[index];
                  const heights = ['h-24', 'h-32', 'h-18'];
                  const podiumHeight = index === 0 ? heights[1] : index === 1 ? heights[0] : heights[2];
                  const medalLabel = index === 0 ? 'ORO' : index === 1 ? 'PLATA' : 'BRONCE';
                  return (
                    <div key={player.rank} className="flex flex-col items-center">
                      <ArcadeAvatar
                        name={player.name}
                        size={index === 0 ? 'lg' : 'md'}
                        level={player.level}
                        ring="gold"
                      />
                      <div className="font-['Press_Start_2P',monospace] text-[9px] text-gold truncate max-w-full mt-1">
                        {player.name}
                      </div>
                      <span className="text-[10px] text-ink-soft font-mono">{player.xp.toLocaleString()} XP</span>
                      <LevelBadge level={player.level} name={player.badge} className="mt-1" />
                      <div
                        className={`w-full ${podiumHeight} bg-gold/40 border-t-4 border-gold rounded-t flex flex-col items-center justify-center mt-2 shadow-lg`}
                      >
                        <span className="font-['Press_Start_2P',monospace] text-xl text-gold">#{player.rank}</span>
                        <span className="text-[9px] text-gold">{medalLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TABLA COMPLETA */}
              <ArcadeCard variant="yellow" className="flex flex-col gap-4">
                <ArcadeTable
                  columns={rankingColumns}
                  rows={visibleRanking}
                  rowKey={(row) => String(row.rank)}
                  rowClassName={(row) => (row.isMe ? 'bg-brand-2/20 font-bold text-brand-2' : '')}
                  sortKey={rankingSortKey}
                  sortDirection={rankingSortDirection}
                  onSort={handleRankingSort}
                  emptyState={
                    <ArcadeEmptyState
                      title="Ranking vacío"
                      description="Todavía nadie sumó XP en esta cohorte."
                      icon={<PixelTrophy className="w-10 h-10" />}
                    />
                  }
                />
                <ArcadePagination
                  page={rankingPage}
                  pageCount={rankingPageCount}
                  onPageChange={setRankingPage}
                />
              </ArcadeCard>

              {/* Posición del usuario actual */}
              <ArcadeCard variant="cyan" className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ArcadeAvatar name="Tamara Alvarez" size="md" level={12} ring="cyan" />
                  <div>
                    <span className="text-xs font-bold text-brand-2">Tu Posición Actual: Puesto #8</span>
                    <p className="text-[10px] text-ink-soft">Estás a solo 400 XP de subir al puesto #7.</p>
                  </div>
                </div>
                <ArcadeBadge tone="yellow" size="md">9.850 XP</ArcadeBadge>
              </ArcadeCard>
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
                <CoinCounter coins={coins} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItems.map((item) => (
                  <ArcadeCard
                    key={item.id}
                    variant="green"
                    className="flex flex-col justify-between gap-3 hover:border-success transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded bg-canvas border border-surface-2 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <ArcadeBadge tone="neutral" appearance="outline" size="sm">
                          {item.tag}
                        </ArcadeBadge>
                      </div>
                      <h3 className="font-bold text-xs text-ink">{item.name}</h3>
                      <p className="text-[11px] text-ink-soft mt-1">{item.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-surface-2/80">
                      <ArcadeBadge tone="yellow" size="sm" icon={<PixelCoin className="w-3 h-3" />}>
                        {item.price}
                      </ArcadeBadge>
                      <ArcadeTooltip
                        content={item.price > coins ? 'No te alcanzan las monedas' : 'Canjear este ítem'}
                      >
                        <ArcadeButton
                          variant="green"
                          size="sm"
                          disabled={item.price > coins}
                          onClick={() => setShopItem(item)}
                        >
                          Canjear
                        </ArcadeButton>
                      </ArcadeTooltip>
                    </div>
                  </ArcadeCard>
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

              <ArcadeCard variant="magenta" className="p-0 flex flex-col h-[480px] overflow-hidden">
                <div className="p-3 bg-canvas/80 border-b border-surface-2 flex items-center justify-between">
                  <span className="text-xs text-ink-soft font-bold"># general-programacion-4</span>
                  <ArcadeBadge tone="green" appearance="outline" size="sm">
                    34 conectados
                  </ArcadeBadge>
                </div>

                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                  {chatMessages.length === 0 ? (
                    <ArcadeEmptyState
                      title="El canal está en silencio"
                      description="Sé la primera persona en escribir algo."
                      icon={<PixelChat className="w-10 h-10" />}
                    />
                  ) : (
                    chatMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-2 max-w-[85%] ${m.isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                      >
                        <ArcadeAvatar name={m.user} size="xs" ring={m.isTeacher ? 'gold' : 'none'} />
                        <div className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[10px] font-bold ${m.isTeacher ? 'text-gold' : m.isMe ? 'text-brand-2' : 'text-ink-soft'}`}>
                              {m.user}
                            </span>
                            {m.isTeacher && (
                              <ArcadeBadge tone="yellow" appearance="outline" size="sm">
                                Docente
                              </ArcadeBadge>
                            )}
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
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendChat} className="p-3 bg-canvas border-t border-surface-2 flex items-end gap-2">
                  <ArcadeInput
                    className="flex-1"
                    placeholder="Escribí un mensaje a la cohorte..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <ArcadeButton type="submit" variant="magenta" size="md" disabled={chatInput.trim() === ''}>
                    <span>ENVIAR</span>
                    <Send className="w-3 h-3" />
                  </ArcadeButton>
                </form>
              </ArcadeCard>
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
              <ArcadeCard variant="magenta" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <ArcadeAvatar name="Tamara Alvarez" size="lg" level={12} ring="magenta" />
                  <div>
                    <h3 className="font-bold text-base text-ink">Tamara Alvarez</h3>
                    <p className="text-xs text-ink-soft">Legajo: 412349 • Tecnicatura Universitaria en Programación</p>
                    <div className="mt-2 max-w-xs">
                      <XPBar currentXP={820} levelXP={1000} level={12} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <LivesIndicator lives={5} />
                  <CoinCounter coins={coins} />
                  <StreakFlame days={9} />
                </div>
              </ArcadeCard>

              {/* 2. LOGROS DEL CURSO */}
              <ArcadeCard variant="yellow">
                <div className="flex items-center gap-2 mb-4">
                  <PixelMedal className="w-4 h-4" />
                  <h3 className="font-['Press_Start_2P',monospace] text-xs text-ink">LOGROS DE LA COHORTE</h3>
                </div>
                <BadgeShowcase badges={courseBadges} />
              </ArcadeCard>

              {/* 3. HISTORIAL DE ACTIVIDADES REALIZADAS (Todos los cursos) */}
              <ArcadeCard variant="default" className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-surface-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-2" />
                    <h3 className="font-['Press_Start_2P',monospace] text-xs text-ink">
                      HISTORIAL DE ACTIVIDADES (TODOS LOS CURSOS)
                    </h3>
                  </div>
                  <span className="text-[10px] text-ink-soft font-mono">Últimas 5 acciones</span>
                </div>

                <ArcadeTable
                  columns={historyColumns}
                  rows={activityHistory}
                  rowKey={(row) => row.id}
                  emptyState={
                    <ArcadeEmptyState
                      title="Sin actividad registrada"
                      description="Empezá por el primer material de la Unidad 1."
                      icon={<PixelScroll className="w-10 h-10" />}
                    />
                  }
                />
              </ArcadeCard>
            </div>
          )}
        </main>
      </div>

      {/* Lector in-app: obliga a hacer scroll hasta el final antes de poder marcar como leído */}
      <ArcadeModal
        open={readerItem !== null}
        onClose={() => setReaderItem(null)}
        title={readerItem?.title}
        subtitle={readerItem?.description}
        tone="green"
        size="xl"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <span className="text-[10px] text-ink-soft">
              {reachedEnd
                ? 'Llegaste al final. Ya podés marcarlo como hecho.'
                : 'Hacé scroll hasta el final para poder marcarlo como hecho.'}
            </span>
            <div className="flex items-center gap-3">
              <StarRating
                value={readerRating}
                onChange={setReaderRating}
                size="sm"
                label="¿Te sirvió este material?"
              />
              <ArcadeButton variant="green" size="sm" disabled={!reachedEnd} onClick={confirmReaderRead}>
                Marcar como hecha
              </ArcadeButton>
            </div>
          </div>
        }
      >
        {readerItem && (
          <>
            <LessonHeader
              title={readerItem.title}
              section={selectedUnit ? `${selectedUnit.name} > Material de Apoyo` : undefined}
              estimatedMinutes={readerItem.estimatedMinutes}
              status={statusOf(readerItem)}
              statusLabels={activityStatusLabels}
            />
            <div
              onScroll={handleReaderScroll}
              className="mt-4 max-h-[55vh] overflow-y-auto pr-2 flex flex-col gap-4"
            >
              {readerItem.blocks?.map(renderBlock)}
              <div className="text-center text-[10px] text-line pt-4">— fin del documento —</div>
            </div>
          </>
        )}
      </ArcadeModal>

      {/* Reproductor de video */}
      <ArcadeModal
        open={videoItem !== null}
        onClose={() => setVideoItem(null)}
        title={videoItem?.title}
        subtitle={videoItem?.description}
        tone="yellow"
        size="lg"
        footer={
          <ArcadeButton
            variant="green"
            size="sm"
            onClick={() => {
              if (videoItem) setReadMap((prev) => ({ ...prev, [videoItem.id]: true }));
              setVideoItem(null);
            }}
          >
            {videoItem?.type === 'audio' ? 'Marcar como escuchada' : 'Marcar como vista'}
          </ArcadeButton>
        }
      >
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <ArcadeSpinner size="lg" label="Cargando el reproductor" />
          {videoItem && resourceIcon(videoItem.type)}
          <p className="text-xs text-ink-soft">
            El reproductor se sirve desde el campus de la facultad. Duración: {videoItem?.durationOrSize}.
          </p>
        </div>
      </ArcadeModal>

      {/* Desafío interactivo */}
      <ArcadeModal
        open={battleItem !== null}
        onClose={() => setBattleItem(null)}
        title={battleItem?.title}
        subtitle={battleItem?.description}
        tone="magenta"
        size="lg"
        dismissable={battleGraded || battleTimedOut}
        footer={
          battleGraded ? (
            <ArcadeButton variant="cyan" size="sm" onClick={() => setBattleItem(null)}>
              Cerrar
            </ArcadeButton>
          ) : (
            <ArcadeButton
              variant="magenta"
              size="sm"
              disabled={
                battleTimedOut ||
                (battleItem?.quiz ?? []).some((q) => (battleAnswers[q.id] ?? []).length === 0)
              }
              onClick={() => setBattleGraded(true)}
            >
              Entregar respuestas
            </ArcadeButton>
          )
        }
      >
        {battleItem && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CountdownTimer
                seconds={battleItem.quizSeconds ?? 300}
                paused={battleGraded}
                warningThreshold={60}
                label="Tiempo restante"
                onExpire={() => {
                  setBattleTimedOut(true);
                  setBattleGraded(true);
                }}
              />
              {battleItem.kind && (
                <ActivityKindBadge kind={battleItem.kind} labels={activityKindLabels} />
              )}
              {battleItem.xp !== undefined && (
                <ArcadeBadge tone="cyan" size="md">+{battleItem.xp} XP en juego</ArcadeBadge>
              )}
            </div>

            {battleTimedOut && !battleGraded && (
              <Callout variant="warning" title="Se acabó el tiempo">
                El desafío se entregó automáticamente con las respuestas que tenías cargadas.
              </Callout>
            )}

            {battleItem.quiz?.map((q) => (
              <MultipleChoice
                key={q.id}
                question={q.question}
                options={q.options}
                multiple={q.multiple}
                value={battleAnswers[q.id] ?? []}
                onChange={(value) => setBattleAnswers((prev) => ({ ...prev, [q.id]: value }))}
                revealed={battleGraded}
                correctIds={q.correctIds}
                disabled={battleGraded}
              />
            ))}

            {battleGraded && (
              <div className="flex flex-col gap-4 pt-2 border-t border-surface-2">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-['Press_Start_2P',monospace] text-xs text-ink">RESULTADO</h4>
                  <GradeBadge score={battleScore()} maxScore={10} passingScore={6} size="md" />
                </div>
                {battleItem.rubric && (
                  <RubricPanel
                    criteria={battleItem.rubric}
                    maxScore={10}
                    passingScore={6}
                    comment="Corrección automática de la cátedra. Los criterios de código los revisa el docente después."
                    totalLabel="Nota final"
                    commentLabel="Devolución"
                    weightLabel="Peso"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </ArcadeModal>

      {/* Confirmación de canje */}
      <ArcadeModal
        open={shopItem !== null}
        onClose={() => setShopItem(null)}
        title="Confirmar canje"
        subtitle={shopItem ? `${shopItem.name} — ${shopItem.price} monedas` : undefined}
        tone="green"
        size="sm"
        footer={
          <div className="flex gap-2">
            <ArcadeButton variant="green" size="sm" onClick={() => setShopItem(null)}>
              Canjear
            </ArcadeButton>
            <ArcadeButton variant="magenta" size="sm" onClick={() => setShopItem(null)}>
              Cancelar
            </ArcadeButton>
          </div>
        }
      >
        <Callout variant="note" title="Antes de confirmar">
          Las monedas se descuentan del saldo de esta cohorte y el canje no se puede revertir.
          Te quedarían {shopItem ? coins - shopItem.price : coins} monedas.
        </Callout>
      </ArcadeModal>
    </div>
  );
};
