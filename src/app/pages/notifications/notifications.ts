import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  GenericBadge,
  GenericButton,
  GenericEmptyState,
  GenericIcon,
  GenericTabs,
  GenericText,
  GenericTitle,
  SentenceCasePipe,
} from 'generic-ui';
import type { GenericIconName, GenericTabItem } from 'generic-ui';
import { NOTIFICATIONS } from '../../core/mock-data';
import { NotificationRow } from '../../core/models';

type NoticeFilter = 'todas' | 'logro' | 'desafio' | 'mensaje';

@Component({
  selector: 'app-notifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericBadge,
    GenericButton,
    GenericEmptyState,
    GenericIcon,
    GenericTabs,
    GenericText,
    GenericTitle,
    SentenceCasePipe,
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  readonly filter = signal<NoticeFilter>('todas');
  readonly items = signal<NotificationRow[]>(NOTIFICATIONS.map((row) => ({ ...row })));
  readonly filterTabs: GenericTabItem[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'logro', label: 'Logros', icon: 'trophy' },
    { id: 'desafio', label: 'Desafíos', icon: 'fire' },
    { id: 'mensaje', label: 'Mensajes', icon: 'chat' },
  ];

  readonly visible = computed(() => {
    const filter = this.filter();
    const rows = this.items();
    if (filter === 'todas') return rows;
    return rows.filter((row) => row.type === filter);
  });

  readonly unreadVisible = computed(() => this.visible().some((row) => !row.read));

  iconFor(row: NotificationRow): GenericIconName {
    if (row.type === 'logro') return 'trophy';
    if (row.type === 'desafio') return 'fire';
    if (row.type === 'mensaje') return 'chat';
    return 'bell';
  }

  toneFor(row: NotificationRow): 'gold' | 'magenta' | 'cyan' | 'neutral' {
    if (row.type === 'logro') return 'gold';
    if (row.type === 'desafio') return 'magenta';
    if (row.type === 'mensaje') return 'cyan';
    return 'neutral';
  }

  typeLabel(row: NotificationRow): string {
    if (row.type === 'logro') return 'Logro';
    if (row.type === 'desafio') return 'Desafío';
    if (row.type === 'mensaje') return 'Mensaje';
    return 'Sistema';
  }

  onTab(tab: GenericTabItem): void {
    if (tab.id === 'todas' || tab.id === 'logro' || tab.id === 'desafio' || tab.id === 'mensaje') {
      this.filter.set(tab.id);
    }
  }

  markRead(id: string): void {
    this.items.update((list) =>
      list.map((row) => (row.id === id ? { ...row, read: true } : row)),
    );
  }

  markAllRead(): void {
    const filter = this.filter();
    this.items.update((list) =>
      list.map((row) =>
        filter === 'todas' || row.type === filter ? { ...row, read: true } : row,
      ),
    );
  }
}
