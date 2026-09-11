import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArcadeNavbar,
  Breadcrumb,
  ArcadeCard,
  ArcadeInput,
  ArcadeButton,
  ArcadeAvatar,
  ArcadeBadge,
  ArcadeEmptyState,
  ArcadeTooltip,
  PixelChat,
} from 'tup-arcade-ui';
import { ArrowLeft, Send, Users, User, Hash } from 'lucide-react';

interface ChatContact {
  id: string;
  name: string;
  role: string;
  type: 'direct' | 'group';
  lastMessage: string;
  unreadCount?: number;
  online?: boolean;
}

interface Message {
  id: string;
  sender: string;
  isMe: boolean;
  text: string;
  timestamp: string;
}

export const MessagingView: React.FC = () => {
  const navigate = useNavigate();
  const [activeContactId, setActiveContactId] = useState<string>('c1');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: ChatContact[] = [
    {
      id: 'c1',
      name: 'Comisión A - General',
      role: 'Canal de Cohorte (34 alumnos)',
      type: 'group',
      lastMessage: 'Prof. Carlos: Mañana cerramos la entrega del TP 1.',
      unreadCount: 2,
    },
    {
      id: 'c2',
      name: 'Prof. Carlos Rossi',
      role: 'Docente Titular',
      type: 'direct',
      lastMessage: 'Perfecto Tamara, revisá la corrección que te envié.',
      online: true,
    },
    {
      id: 'c3',
      name: 'Equipo TP - Retro Devs',
      role: 'Grupo TP Integrador (4 miembros)',
      type: 'group',
      lastMessage: 'Lucas: Ya subí la rama con los componentes nes.css.',
      unreadCount: 1,
    },
    {
      id: 'c4',
      name: 'Matias Gomez',
      role: 'Compañero de comisión',
      type: 'direct',
      lastMessage: '¿A qué hora nos conectamos para probar el boss fight?',
      online: false,
    },
  ];

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({
    c1: [
      { id: 'm1', sender: 'Lucas', isMe: false, text: 'Buenas gente, ¿alguien pudo armar el despliegue con Docker?', timestamp: '14:20' },
      { id: 'm2', sender: 'Tamara', isMe: true, text: 'Sí, fíjate en el material de la Unidad 1 que está el archivo docker-compose de ejemplo.', timestamp: '14:25' },
      { id: 'm3', sender: 'Prof. Carlos', isMe: false, text: 'Recuerden que mañana a las 23:59 cerramos la entrega del TP 1. No dejen para último minuto.', timestamp: '15:10' },
    ],
    c2: [
      { id: 'm4', sender: 'Tamara', isMe: true, text: 'Hola Profe, le dejé la duda sobre la arquitectura hexagonal en el foro.', timestamp: '10:00' },
      { id: 'm5', sender: 'Prof. Carlos Rossi', isMe: false, text: 'Perfecto Tamara, revisá la corrección que te envié.', timestamp: '11:15' },
    ],
    c3: [
      { id: 'm6', sender: 'Lucas', isMe: false, text: 'Ya subí la rama con los componentes nes.css.', timestamp: '16:00' },
    ],
    c4: [
      { id: 'm7', sender: 'Matias Gomez', isMe: false, text: '¿A qué hora nos conectamos para probar el boss fight?', timestamp: 'Ayer' },
    ],
  });

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const currentMessages = messagesMap[activeContactId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      sender: 'Tamara',
      isMe: true,
      text: inputText.trim(),
      timestamp: 'Ahora',
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg],
    }));
    setInputText('');
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-canvas text-ink font-mono relative overflow-hidden flex flex-col">
      <div className="crt-overlay absolute inset-0 pointer-events-none z-50" />

      <ArcadeNavbar
        unreadMessages={0}
        unreadNotifications={3}
        onNavigateMessages={() => navigate('/messages')}
        onNavigateNotifications={() => navigate('/notifications')}
        onEditProfile={() => navigate('/profile')}
        onLogout={() => navigate('/login')}
      />

      <div className="px-4 sm:px-6 pt-3">
        <Breadcrumb items={[{ label: 'Mensajería' }]} onHome={() => navigate('/my-courses')} />
      </div>

      <div className="flex-1 w-full p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-116px)]">
        {/* Contactos / Canales */}
        <ArcadeCard variant="cyan" className="md:col-span-4 lg:col-span-4 p-0 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-surface-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ArcadeButton
                variant="cyan"
                size="sm"
                onClick={() => navigate(-1)}
                aria-label="Volver"
              >
                <ArrowLeft className="w-4 h-4" />
              </ArcadeButton>
              <span className="font-['Press_Start_2P',monospace] text-[11px] text-brand-2">
                MENSAJERÍA
              </span>
            </div>
            <PixelChat className="w-4 h-4" />
          </div>

          <div className="p-2.5 border-b border-surface-2">
            <ArcadeInput
              type="search"
              placeholder="Buscar contactos o canales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
            {filteredContacts.length === 0 ? (
              <ArcadeEmptyState
                title="Sin resultados"
                description="Probá con otro nombre de contacto o canal."
                icon={<PixelChat className="w-10 h-10" />}
              />
            ) : (
              filteredContacts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveContactId(c.id)}
                  className={`w-full p-2.5 rounded border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    activeContactId === c.id
                      ? 'bg-surface-2 border-brand-2 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : 'bg-canvas/60 border-surface-2/80 hover:border-line'
                  }`}
                >
                  <ArcadeAvatar
                    name={c.name}
                    size="sm"
                    ring={c.online ? 'green' : 'none'}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-ink truncate">{c.name}</span>
                      {c.unreadCount && (
                        <ArcadeBadge tone="magenta" size="sm">
                          {c.unreadCount}
                        </ArcadeBadge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {c.type === 'group' ? (
                        <Users className="w-3 h-3 text-ink-soft shrink-0" />
                      ) : (
                        <User className="w-3 h-3 text-ink-soft shrink-0" />
                      )}
                      <p className="text-[10px] text-ink-soft truncate">{c.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ArcadeCard>

        {/* Ventana de Chat Activo */}
        <ArcadeCard variant="magenta" className="md:col-span-8 lg:col-span-8 p-0 flex flex-col overflow-hidden">
          {/* Header del Chat */}
          <div className="p-3.5 border-b border-surface-2 bg-canvas/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArcadeAvatar
                name={activeContact.name}
                size="md"
                ring={activeContact.online ? 'green' : 'none'}
              />
              <div>
                <h2 className="font-bold text-sm text-brand-2 flex items-center gap-1.5">
                  {activeContact.type === 'group' && <Hash className="w-3.5 h-3.5" />}
                  {activeContact.name}
                </h2>
                <p className="text-[10px] text-ink-soft">{activeContact.role}</p>
              </div>
            </div>

            {activeContact.online !== undefined && (
              <ArcadeTooltip
                content={activeContact.online ? 'Disponible ahora' : 'Última conexión desconocida'}
                side="left"
              >
                <ArcadeBadge
                  tone={activeContact.online ? 'green' : 'neutral'}
                  appearance="outline"
                  size="sm"
                >
                  {activeContact.online ? 'En línea' : 'Desconectado'}
                </ArcadeBadge>
              </ArcadeTooltip>
            )}
          </div>

          {/* Lista de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {currentMessages.length === 0 ? (
              <ArcadeEmptyState
                title="Todavía no hay mensajes"
                description={`Escribile a ${activeContact.name} para empezar la conversación.`}
                icon={<PixelChat className="w-10 h-10" />}
              />
            ) : (
              currentMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 max-w-[80%] ${m.isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <ArcadeAvatar name={m.sender} size="xs" />
                  <div className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                    {!m.isMe && (
                      <span className="text-[10px] text-ink-soft mb-1 font-bold">{m.sender}</span>
                    )}
                    <div
                      className={`p-3 rounded border text-xs leading-relaxed ${
                        m.isMe
                          ? 'bg-brand-2/80 border-brand-2 text-brand-2 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                          : 'bg-canvas border-line text-ink'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-ink-soft mt-1">{m.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input de Mensaje */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-surface-2 bg-canvas/80 flex items-end gap-2">
            <ArcadeInput
              className="flex-1"
              placeholder={`Enviar mensaje a ${activeContact.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <ArcadeButton type="submit" variant="cyan" size="md" disabled={inputText.trim() === ''}>
              <span>ENVIAR</span>
              <Send className="w-3.5 h-3.5" />
            </ArcadeButton>
          </form>
        </ArcadeCard>
      </div>
    </div>
  );
};
