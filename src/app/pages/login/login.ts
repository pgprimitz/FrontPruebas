import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  GenericBadge,
  GenericButton,
  GenericCard,
  GenericCheckbox,
  GenericIcon,
  GenericInput,
  GenericModal,
  GenericSelect,
  GenericSpinner,
  GenericText,
  GenericTitle,
} from 'generic-ui';
import type { GenericSelectOption } from 'generic-ui';
import { UserRole } from '../../core/models';
import { SessionService } from '../../core/session.service';
import { SiteFooter } from '../../layout/site-footer';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericBadge,
    GenericButton,
    GenericCard,
    GenericCheckbox,
    GenericIcon,
    GenericInput,
    GenericModal,
    GenericSelect,
    GenericSpinner,
    GenericText,
    GenericTitle,
    SiteFooter,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);

  readonly roleOptions: GenericSelectOption[] = [
    { value: 'student', label: 'Alumno' },
    { value: 'teacher', label: 'Profesor' },
    { value: 'admin', label: 'Admin' },
  ];

  readonly role = signal<UserRole>('student');
  readonly username = signal('');
  readonly password = signal('');
  readonly remember = signal(false);
  readonly usernameError = signal('');
  readonly passwordError = signal('');
  readonly submitting = signal(false);
  readonly registerOpen = signal(false);
  readonly recoveryOpen = signal(false);
  readonly recoveryEmail = signal('');
  readonly recoverySent = signal(false);

  identifierLabel(): string {
    return this.role() === 'student' ? 'Usuario o Legajo' : 'Correo institucional';
  }

  identifierPlaceholder(): string {
    return this.role() === 'student' ? 'Ej: 412349 o gamer_tag' : 'docente@frt.utn.edu.ar';
  }

  pickRole(value: string): void {
    if (value !== 'student' && value !== 'teacher' && value !== 'admin') return;
    this.role.set(value);
    this.usernameError.set('');
    this.passwordError.set('');
  }

  closeRecovery(): void {
    this.recoveryOpen.set(false);
    this.recoverySent.set(false);
    this.recoveryEmail.set('');
  }

  sendRecovery(): void {
    if (!this.recoveryEmail().includes('@')) return;
    this.recoverySent.set(true);
  }

  submit(): void {
    this.usernameError.set('');
    this.passwordError.set('');
    const user = this.username().trim();
    const pass = this.password();

    if (!user) {
      this.usernameError.set(`Completá tu ${this.identifierLabel().toLowerCase()}.`);
    } else if (this.role() !== 'student' && !user.includes('@')) {
      this.usernameError.set('Usá tu correo institucional completo.');
    }

    if (!pass) {
      this.passwordError.set('Completá tu contraseña.');
    } else if (pass.length < 6) {
      this.passwordError.set('La contraseña tiene al menos 6 caracteres.');
    }

    if (this.usernameError() || this.passwordError()) return;

    this.submitting.set(true);
    window.setTimeout(() => {
      this.session.login(this.role(), user);
      void this.router.navigateByUrl('/my-courses');
    }, 400);
  }
}
