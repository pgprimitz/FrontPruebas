import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  GenericAvatar,
  GenericBadgeShowcase,
  GenericCallout,
  GenericCoinCounter,
  GenericLevelBadge,
  GenericStat,
  GenericStreakFlame,
  GenericXpBar,
} from 'generic-ui';
import type { GenericAchievementBadge } from 'generic-ui';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericAvatar,
    GenericBadgeShowcase,
    GenericCallout,
    GenericCoinCounter,
    GenericLevelBadge,
    GenericStat,
    GenericStreakFlame,
    GenericXpBar,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly session = inject(SessionService);
  readonly name = this.session.user()?.username?.trim() || 'Alumno';
  readonly selectedBadge = signal<GenericAchievementBadge | null>(null);
  readonly badges: GenericAchievementBadge[] = [
    { id: 'u1', label: 'Unidad 1', iconName: 'trophy', earned: true, description: 'Cerraste la U1 al 100%.' },
    { id: 'docker', label: 'Docker', iconName: 'chest', earned: true, description: 'Imagen local del front.' },
    { id: 'streak', label: 'Racha 5', iconName: 'fire', earned: true, description: 'Cinco días seguidos.' },
    { id: 'top10', label: 'Top 10', iconName: 'medal', earned: true, description: 'Puesto #8 de la cohorte.' },
    { id: 'boss', label: 'Boss Fight', iconName: 'star', earned: false, description: 'Todavía no habilitado.' },
    { id: 'chat', label: 'Mentoría', iconName: 'chat', earned: false, description: 'Respondé 10 dudas.' },
  ];

  onBadge(badge: GenericAchievementBadge): void {
    this.selectedBadge.set(badge);
  }
}
