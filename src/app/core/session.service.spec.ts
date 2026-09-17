import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';

describe('SessionService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('starts logged out', () => {
    const session = TestBed.inject(SessionService);
    expect(session.isAuthenticated()).toBe(false);
  });

  it('stores role and username on login', () => {
    const session = TestBed.inject(SessionService);
    session.login('student', 'tami');
    expect(session.isAuthenticated()).toBe(true);
    expect(session.user()?.role).toBe('student');
    expect(session.user()?.username).toBe('tami');
  });

  it('clears the session on logout', () => {
    const session = TestBed.inject(SessionService);
    session.login('admin', 'root');
    session.logout();
    expect(session.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('tup-session')).toBeNull();
  });
});
