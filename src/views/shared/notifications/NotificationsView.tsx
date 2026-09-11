import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArcadeNavbar,
  Breadcrumb,
  ArcadeButton,
  ArcadeCard,
  ArcadeBadge,
  ArcadeTabs,
  ArcadeModal,
  ArcadeEmptyState,
  PixelTrophy,
  PixelStar,
  PixelBell,
  PixelChat,
  PixelCoin,
  PixelQuiz,
} from 'tup-arcade-ui';
import type { ArcadeBadgeTone } from 'tup-arcade-ui';
import { ArrowLeft, Check, Trash2 } from 'lucide-react';

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
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
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
    setConfirmClearOpen(false);
  };

  const countFor = (type: NotificationType) =>
    type === 'all'
      ? notifications.length
      : notifications.filter(n => n.type === type).length;

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'achievement':
        return <PixelTrophy className="w-4 h-4" />;
      case 'challenge':
        return <PixelQuiz className="w-4 h-4" />;
      case 'message':
        return <PixelChat className="w-4 h-4" />;
      case 'system':
      default:
        return <PixelStar className="w-4 h-4" />;
    }
  };

  const getNotificationTone = (type: NotificationItem['type']): ArcadeBadgeTone => {
    switch (type) {
      case 'achievement':
        return 'yellow';
      case 'challenge':
        return 'red';
      case 'message':
        return 'cyan';
      case 'system':
      default:
        return 'green';
    }
  };

  const typeLabels: Record<NotificationItem['type'], string> = {
    achievement: 'Logro',
    challenge: 'Desafío',
    message: 'Mensaje',
    system: 'Sistema',
  };

  const readCount = notifications.filter(n => n.read).length;

  return (
    <div className="flex flex-1 flex-col w-full bg-canvas text-ink font-mono">
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
            <ArcadeButton
              variant="cyan"
              size="sm"
              onClick={() => navigate("/my-courses")}
              aria-label="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </ArcadeButton>
            <div>
              <div className="flex items-center gap-2">
                <PixelBell className="w-4 h-4" />
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
            <ArcadeButton variant="cyan" size="sm" onClick={markAllAsRead}>
              <Check className="w-3.5 h-3.5" />
              <span>Marcar leídas</span>
            </ArcadeButton>
            <ArcadeButton
              variant="magenta"
              size="sm"
              disabled={readCount === 0}
              onClick={() => setConfirmClearOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </ArcadeButton>
          </div>
        </div>

        <ArcadeTabs
          className="mb-6"
          activeId={filter}
          onChange={(id) => setFilter(id as NotificationType)}
          tabs={[
            { id: 'all', label: 'Todas', badge: countFor('all') },
            { id: 'achievement', label: 'Logros', badge: countFor('achievement') },
            { id: 'challenge', label: 'Desafíos', badge: countFor('challenge') },
            { id: 'message', label: 'Mensajes', badge: countFor('message') },
            { id: 'system', label: 'Sistema', badge: countFor('system') },
          ]}
        />

        <div className="flex flex-col gap-3">
          {filteredNotifications.length === 0 ? (
            <ArcadeEmptyState
              title="No hay notificaciones en esta categoría"
              description="Cuando ocurra un evento de este tipo, lo vas a ver acá."
              icon={<PixelBell className="w-10 h-10" />}
              action={
                filter !== 'all' ? (
                  <ArcadeButton variant="cyan" size="sm" onClick={() => setFilter('all')}>
                    Ver todas
                  </ArcadeButton>
                ) : undefined
              }
            />
          ) : (
            filteredNotifications.map((n) => (
              <ArcadeCard
                key={n.id}
                variant={n.read ? 'default' : 'yellow'}
                glow={!n.read}
                className={`flex items-start gap-4 ${n.read ? 'opacity-75' : ''}`}
              >
                <div className="shrink-0 pt-0.5">{getNotificationIcon(n.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-['Press_Start_2P',monospace] text-[11px] text-ink tracking-wide">
                      {n.title}
                    </h3>
                    <span className="text-[10px] text-ink-soft whitespace-nowrap">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-ink-soft mt-1.5 leading-relaxed">{n.description}</p>

                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <ArcadeBadge tone={getNotificationTone(n.type)} appearance="outline" size="sm">
                      {typeLabels[n.type]}
                    </ArcadeBadge>
                    {n.xpReward && (
                      <ArcadeBadge tone="cyan" size="sm">
                        +{n.xpReward} XP
                      </ArcadeBadge>
                    )}
                    {n.coinReward && (
                      <ArcadeBadge tone="yellow" size="sm" icon={<PixelCoin className="w-3 h-3" />}>
                        +{n.coinReward}
                      </ArcadeBadge>
                    )}
                  </div>
                </div>

                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse shrink-0 self-center" />
                )}
              </ArcadeCard>
            ))
          )}
        </div>
      </main>

      <ArcadeModal
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        title="Limpiar notificaciones leídas"
        subtitle={`Se van a borrar ${readCount} notificaciones. No se puede deshacer.`}
        tone="red"
        size="sm"
        footer={
          <div className="flex gap-2">
            <ArcadeButton variant="magenta" size="sm" onClick={clearRead}>
              Limpiar
            </ArcadeButton>
            <ArcadeButton variant="cyan" size="sm" onClick={() => setConfirmClearOpen(false)}>
              Cancelar
            </ArcadeButton>
          </div>
        }
      >
        <p className="text-xs text-ink-soft">
          Las notificaciones sin leer se mantienen intactas.
        </p>
      </ArcadeModal>
    </div>
  );
};
