import { Injectable, signal } from '@angular/core';
import { SessionUser, UserRole } from './models';

const STORAGE_KEY = 'tup-session';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly session = signal<SessionUser | null>(this.read());
  readonly user = this.session.asReadonly();

  isAuthenticated(): boolean {
    return this.session() !== null;
  }

  login(role: UserRole, username: string): void {
    const next: SessionUser = { role, username };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    this.session.set(next);
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.session.set(null);
  }

  private read(): SessionUser | null {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as SessionUser;
      if (!parsed.role || !parsed.username) return null;
      return parsed;
    } catch {
      return null;
    }
  }
}
