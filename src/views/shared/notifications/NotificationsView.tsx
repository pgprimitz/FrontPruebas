import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArcadeNavbar, Breadcrumb } from 'tup-arcade-ui';
import { ArrowLeft, Check, Trash2, Filter } from 'lucide-react';

export type NotificationType = 'all' | 'achievement' | 'challenge' | 'system' | 'message';

export interface NotificationItem {
  id: string;
  type: 'achievement' | 'challenge' | 'system' | 'message';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  xpReward?: number;
  coinReward?: number;
}

export const NotificationsView: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<NotificationType>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      type: 'achievement',
      title: '¡NUEVO LOGRO DESBLOQUEADO!',
      description: 'Completaste la Unidad 1 de Programación IV con 100% de efectividad.',
      timestamp: 'Hace 10 min',
      read: false,
      xpReward: 250,
      coinReward: 50,
    },
    {
      id: 'n2',
      type: 'challenge',
      title: 'NUEVO DESAFÍO EN COHORTE',
      description: 'El docente habilitó el Boss Fight: "Microfrontends con Module Federation". Quedan 3 días.',
      timestamp: 'Hace 2 horas',
      read: false,
      xpReward: 500,
    },
    {
      id: 'n3',
      type: 'message',
      title: 'NUEVO MENSAJE DE COHORTE',
      description: 'Prof. Carlos Rossi respondió en #dudas-tp: "Revisen el diagrama de componentes en el apunte."',
      timestamp: 'Hace 4 horas',
      read: true,
    },
    {
      id: 'n4',
      type: 'system',
      title: 'RECUPERACIÓN DE VIDAS',
      description: 'Tu racha de 5 días activos te otorgó +1 Vida de reserva.',
      timestamp: 'Ayer',
      read: true,
      coinReward: 10,
    },
    {
      id: 'n5',
      type: 'achievement',
      title: 'TOP 10 ALCANZADO',
      description: 'Subiste al puesto #8 en el Ranking global de la cohorte.',
      timestamp: 'Hace 2 días',
      read: true,
      xpReward: 100,
    },
  ]);

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'achievement':
        return <i className="nes-icon is-small trophy" />;
      case 'challenge':
        return <i className="nes-icon is-small sword" />;
      case 'message':
        return <i className="nes-icon is-small mail" />;
      case 'system':
      default:
        return <i className="nes-icon is-small star" />;
    }
  };

  const getNotificationColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'achievement':
        return 'text-gold border-gold/40 bg-gold/20';
      case 'challenge':
        return 'text-danger border-danger/40 bg-danger/20';
      case 'message':
        return 'text-brand-2 border-brand-2/40 bg-brand-2/20';
      case 'system':
      default:
        return 'text-success border-success/40 bg-success/20';
    }
  };

  return (
    <div className="min-h-screen w-full bg-canvas text-ink font-mono relative overflow-hidden">
      <div className="crt-overlay absolute inset-0 pointer-events-none z-50" />

      <ArcadeNavbar
        unreadMessages={2}
        unreadNotifications={notifications.filter(n => !n.read).length}
        onNavigateMessages={() => navigate('/messages')}
        onNavigateNotifications={() => navigate('/notifications')}
        onEditProfile={() => navigate('/profile')}
        onLogout={() => navigate('/login')}
      />

      <main className="w-full px-4 sm:px-6 py-8">
        <Breadcrumb items={[{ label: 'Notificaciones' }]} onHome={() => navigate('/my-courses')} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-4 pb-4 border-b border-surface-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded bg-surface border border-line hover:border-brand-2 text-ink-soft hover:text-brand-2 transition-all cursor-pointer"
              title="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <i className="nes-icon is-small star" />
                <h1 className="font-['Press_Start_2P',monospace] text-sm sm:text-base text-gold">
                  CENTRO DE NOTIFICACIONES
                </h1>
              </div>
              <p className="text-xs text-ink-soft mt-1">
                Registros de eventos, logros desbloqueados y avisos de cátedra.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface border border-line hover:border-brand-2 text-xs text-ink-soft hover:text-brand-2 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Marcar leídas</span>
            </button>
            <button
              type="button"
              onClick={clearRead}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface border border-line hover:border-danger text-xs text-ink-soft hover:text-danger cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
          <span className="text-xs text-ink-soft flex items-center gap-1 font-['Press_Start_2P',monospace] text-[9px] mr-2">
            <Filter className="w-3 h-3" /> TIPO:
          </span>
          {[
            { key: 'all', label: 'Todas' },
            { key: 'achievement', label: 'Logros' },
            { key: 'challenge', label: 'Desafíos' },
            { key: 'message', label: 'Mensajes' },
            { key: 'system', label: 'Sistema' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key as NotificationType)}
              className={`px-3 py-1 rounded text-xs transition-all cursor-pointer whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-gold text-slate-950 font-bold border border-gold shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'bg-surface text-ink-soft hover:text-ink border border-surface-2'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-surface-2 rounded-lg">
              <i className="nes-icon is-large coin mb-4" />
              <p className="font-['Press_Start_2P',monospace] text-xs text-ink-soft">
                NO HAY NOTIFICACIONES EN ESTA CATEGORÍA
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded border transition-all flex items-start gap-4 ${
                  n.read
                    ? 'bg-surface/50 border-surface-2 opacity-75'
                    : 'bg-surface border-gold/60 shadow-[0_0_10px_rgba(251,191,36,0.15)]'
                }`}
              >
                <div className={`p-2.5 rounded border flex items-center justify-center shrink-0 ${getNotificationColor(n.type)}`}>
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-['Press_Start_2P',monospace] text-[11px] text-ink tracking-wide">
                      {n.title}
                    </h3>
                    <span className="text-[10px] text-ink-soft whitespace-nowrap">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-ink-soft mt-1.5 leading-relaxed">{n.description}</p>

                  {(n.xpReward || n.coinReward) && (
                    <div className="flex items-center gap-3 mt-2.5">
                      {n.xpReward && (
                        <span className="text-[10px] font-['Press_Start_2P',monospace] text-brand-2 bg-brand-2/60 border border-brand-2/40 px-2 py-0.5 rounded">
                          +{n.xpReward} XP
                        </span>
                      )}
                      {n.coinReward && (
                        <span className="text-[10px] font-['Press_Start_2P',monospace] text-gold bg-gold/60 border border-gold/40 px-2 py-0.5 rounded flex items-center gap-1">
                          <i className="nes-icon is-small coin scale-75" />
                          +{n.coinReward}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse shrink-0 self-center" />
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
