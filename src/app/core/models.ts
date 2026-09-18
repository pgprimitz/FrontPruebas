export type UserRole = 'student' | 'teacher' | 'admin';

export interface SessionUser {
  role: UserRole;
  username: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  cohort: string;
  progress: number;
  lives: number;
  coins: number;
  tone: 'cyan' | 'magenta';
  courseTone: 'celeste' | 'rosa';
  status: 'Cursando';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  durationLabel: string;
}

export type ResourceSection = 'teorico' | 'audiovisual' | 'apoyo' | 'desafio';

export interface CourseResource {
  id: string;
  section: ResourceSection;
  title: string;
  subtitle: string;
  size: string;
  tags: Array<'correccion' | 'obligatorio' | 'opcional'>;
  done: boolean;
}

export interface CourseUnit {
  id: string;
  label: string;
  title: string;
  description: string;
  progress: number;
  resources: CourseResource[];
}

export type CourseTab = 'roadmap' | 'ranking' | 'shop' | 'chat' | 'profile';

export interface NotificationRow {
  id: string;
  title: string;
  description: string;
  type: 'logro' | 'desafio' | 'mensaje' | 'sistema';
  when: string;
  read: boolean;
  xp?: number;
  coins?: number;
}

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  initials: string;
  lastMessage: string;
  unread: number;
}

export interface ChatThread {
  id: string;
  name: string;
  messages: { id: string; text: string; from: 'me' | 'them' }[];
}
