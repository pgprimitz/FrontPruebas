import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  GenericDropdown,
  GenericIcon,
  GenericMenuItem,
  GenericText,
  GenericTitle,
  ThemeService,
} from 'generic-ui';
import { filter, map, startWith } from 'rxjs';
import { COURSES } from '../core/mock-data';
import { SessionService } from '../core/session.service';
import { SiteFooter } from './site-footer';

interface Crumb {
  label: string;
  path: string;
}

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, GenericDropdown, GenericIcon, GenericText, GenericTitle, SiteFooter],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  readonly theme = inject(ThemeService);

  readonly user = this.session.user;
  readonly dark = computed(() => this.theme.theme() === 'dark');
  readonly legajo = computed(() => {
    const name = this.user()?.username?.trim() || '';
    if (!name) return '000000';
    if (name.includes('@')) {
      const digits = name.replace(/\D/g, '');
      return digits || '412349';
    }
    return name;
  });
  readonly accountItems: GenericMenuItem[] = [
    { id: 'profile', label: 'Perfil' },
    { id: 'logout', label: 'Salir', danger: true },
  ];

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly crumbs = computed<Crumb[]>(() => this.navFor(this.url()).crumbs);
  readonly pageTitle = computed(() => this.navFor(this.url()).title);

  go(path: string): void {
    void this.router.navigateByUrl(path);
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  onAccount(item: GenericMenuItem): void {
    if (item.id === 'profile') this.go('/profile');
    if (item.id === 'logout') {
      this.session.logout();
      this.go('/login');
    }
  }

  private navFor(url: string): { crumbs: Crumb[]; title: string } {
    const path = url.split('?')[0];
    const home: Crumb = { label: 'Inicio', path: '/my-courses' };
    const courses: Crumb = { label: 'Mis cursos', path: '/my-courses' };

    if (path.startsWith('/course/')) {
      const id = path.split('/')[2] ?? '';
      const course = COURSES.find((item) => item.id === id);
      const title = course?.title || course?.code || 'Curso';
      return {
        crumbs: [home, courses, { label: title, path }],
        title,
      };
    }

    if (path.startsWith('/notifications')) {
      return { crumbs: [home, { label: 'Notificaciones', path: '/notifications' }], title: 'Notificaciones' };
    }
    if (path.startsWith('/messages')) {
      return { crumbs: [home, { label: 'Mensajes', path: '/messages' }], title: 'Mensajes' };
    }
    if (path.startsWith('/profile')) {
      return { crumbs: [home, { label: 'Perfil', path: '/profile' }], title: 'Perfil' };
    }
    if (path.startsWith('/teams/')) {
      const id = path.split('/')[2] ?? '01';
      return {
        crumbs: [home, { label: 'Equipos', path: `/teams/${id}` }, { label: `Grupo ${id}`, path }],
        title: `Grupo ${id}`,
      };
    }

    return { crumbs: [home, courses], title: 'Mis cursos' };
  }
}
