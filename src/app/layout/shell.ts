import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  GenericBreadcrumb,
  GenericDropdown,
  GenericMenuItem,
  GenericNavbar,
} from 'generic-ui';
import type { GenericBreadcrumbItem, GenericNavItem } from 'generic-ui';
import { filter, map, startWith } from 'rxjs';
import { COURSES } from '../core/mock-data';
import { SessionService } from '../core/session.service';
import { SiteFooter } from './site-footer';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    GenericBreadcrumb,
    GenericDropdown,
    GenericNavbar,
    SiteFooter,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);

  readonly user = this.session.user;
  readonly displayName = computed(() => this.user()?.username?.trim() || 'Alumno');
  readonly navItems: GenericNavItem[] = [
    { id: 'courses', label: 'Cursos', icon: 'scroll' },
    { id: 'messages', label: 'Mensajes', icon: 'chat' },
    { id: 'notifications', label: 'Avisos', icon: 'bell' },
  ];
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

  readonly crumbItems = computed<GenericBreadcrumbItem[]>(() => this.navFor(this.url()).crumbs);
  readonly activeNavId = computed(() => {
    const path = this.url().split('?')[0];
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/notifications')) return 'notifications';
    if (path.startsWith('/profile')) return null;
    return 'courses';
  });

  go(path: string): void {
    void this.router.navigateByUrl(path);
  }

  onProfile(): boolean {
    return this.url().split('?')[0].startsWith('/profile');
  }

  onNav(item: GenericNavItem): void {
    if (item.id === 'courses') this.go('/my-courses');
    if (item.id === 'messages') this.go('/messages');
    if (item.id === 'notifications') this.go('/notifications');
  }

  onCrumb(item: GenericBreadcrumbItem): void {
    if (item.href) this.go(item.href);
  }

  onAccount(item: GenericMenuItem): void {
    if (item.id === 'profile') this.go('/profile');
    if (item.id === 'logout') {
      this.session.logout();
      this.go('/login');
    }
  }

  private navFor(url: string): { crumbs: GenericBreadcrumbItem[]; title: string } {
    const path = url.split('?')[0];
    const home: GenericBreadcrumbItem = { id: 'home', label: 'Inicio', href: '/my-courses' };
    const courses: GenericBreadcrumbItem = {
      id: 'courses',
      label: 'Mis cursos',
      href: '/my-courses',
    };

    if (path.startsWith('/course/')) {
      const id = path.split('/')[2] ?? '';
      const course = COURSES.find((item) => item.id === id);
      const title = course?.title || course?.code || 'Curso';
      return {
        crumbs: [home, courses, { id: 'course', label: title, href: path }],
        title,
      };
    }

    if (path.startsWith('/notifications')) {
      return {
        crumbs: [home, { id: 'notifications', label: 'Notificaciones', href: '/notifications' }],
        title: 'Notificaciones',
      };
    }
    if (path.startsWith('/messages')) {
      return {
        crumbs: [home, { id: 'messages', label: 'Mensajes', href: '/messages' }],
        title: 'Mensajes',
      };
    }
    if (path.startsWith('/profile')) {
      return {
        crumbs: [home, { id: 'profile', label: 'Perfil', href: '/profile' }],
        title: 'Perfil',
      };
    }
    if (path.startsWith('/teams/')) {
      const id = path.split('/')[2] ?? '01';
      return {
        crumbs: [
          home,
          { id: 'teams', label: 'Equipos', href: `/teams/${id}` },
          { id: 'team', label: `Grupo ${id}`, href: path },
        ],
        title: `Grupo ${id}`,
      };
    }

    return { crumbs: [home, courses], title: 'Mis cursos' };
  }
}
