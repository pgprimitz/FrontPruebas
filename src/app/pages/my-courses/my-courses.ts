import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  GenericBadge,
  GenericButton,
  GenericCard,
  GenericIcon,
  GenericModal,
  GenericProgress,
  GenericText,
  GenericTitle,
} from 'generic-ui';
import { COURSES } from '../../core/mock-data';
import { Course } from '../../core/models';

@Component({
  selector: 'app-my-courses',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericBadge,
    GenericButton,
    GenericCard,
    GenericIcon,
    GenericModal,
    GenericProgress,
    GenericText,
    GenericTitle,
  ],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css',
})
export class MyCourses {
  private readonly router = inject(Router);
  readonly courses = COURSES;
  readonly selected = signal<Course | null>(null);
  readonly modalOpen = signal(false);
  readonly adventureOpen = signal(false);

  open(course: Course): void {
    this.selected.set(course);
    this.modalOpen.set(true);
  }

  enterSpeedrun(): void {
    const course = this.selected();
    if (!course) return;
    this.modalOpen.set(false);
    void this.router.navigate(['/course', course.id, 'simplified']);
  }
}
