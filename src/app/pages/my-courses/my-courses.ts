import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  GenericBadge,
  GenericButton,
  GenericCard,
  GenericCoinCounter,
  GenericCourseMetaBadges,
  GenericCourseModal,
  GenericProgress,
  GenericText,
  GenericTitle,
  SentenceCasePipe,
} from 'generic-ui';
import type { GenericCourseBadge } from 'generic-ui';
import { COURSES } from '../../core/mock-data';
import { Course } from '../../core/models';

@Component({
  selector: 'app-my-courses',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericBadge,
    GenericButton,
    GenericCard,
    GenericCoinCounter,
    GenericCourseMetaBadges,
    GenericCourseModal,
    GenericProgress,
    GenericText,
    GenericTitle,
    SentenceCasePipe,
  ],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css',
})
export class MyCourses {
  private readonly router = inject(Router);
  readonly courses = COURSES;
  readonly selected = signal<Course | null>(null);
  readonly modalOpen = signal(false);

  readonly selectedBadges = computed<GenericCourseBadge[]>(() => {
    const course = this.selected();
    if (!course) return [];
    return [
      { label: course.status, tone: course.tone, appearance: 'outline' },
      { label: course.language, tone: 'neutral', appearance: 'outline' },
    ];
  });

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
