import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import {
  GenericActivityKindBadge,
  GenericActivityStatusBadge,
  GenericBadge,
  GenericButton,
  GenericCallout,
  GenericCard,
  GenericCourseOutline,
  GenericEmptyState,
  GenericIcon,
  GenericLessonHeader,
  GenericModal,
  GenericProgress,
  GenericSubtitle,
  GenericText,
  GenericTitle,
  GenericTooltip,
  SentenceCasePipe,
} from 'generic-ui';
import type {
  ActivityKind,
  ActivityStatus,
  GenericIconName,
  GenericOutlineLesson,
  GenericOutlineModule,
} from 'generic-ui';
import { COURSE_UNITS, COURSES } from '../../core/mock-data';
import { CourseResource, CourseTab, CourseUnit, ResourceSection } from '../../core/models';

interface CourseNavItem {
  id: CourseTab;
  label: string;
  icon: GenericIconName;
  owned: boolean;
}

interface UnitNavItem {
  id: ResourceSection;
  label: string;
  short: string;
  icon: GenericIconName;
  kind: ActivityKind;
}

interface SectionCopy {
  heading: string;
  empty: string;
}

@Component({
  selector: 'app-course',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericActivityKindBadge,
    GenericActivityStatusBadge,
    GenericBadge,
    GenericButton,
    GenericCallout,
    GenericCard,
    GenericCourseOutline,
    GenericEmptyState,
    GenericIcon,
    GenericLessonHeader,
    GenericModal,
    GenericProgress,
    GenericSubtitle,
    GenericText,
    GenericTitle,
    GenericTooltip,
    SentenceCasePipe,
  ],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class CoursePage {
  private readonly sentence = new SentenceCasePipe();
  readonly id = input.required<string>();
  readonly courseTab = signal<CourseTab>('roadmap');
  readonly unitId = signal<string | null>(null);
  readonly section = signal<ResourceSection>('teorico');
  readonly doneIds = signal<Record<string, boolean>>({});
  readonly preview = signal<CourseResource | null>(null);
  readonly selectedResourceId = signal<string | null>(null);

  readonly courseTabs: CourseNavItem[] = [
    { id: 'roadmap', label: 'Roadmap', icon: 'scroll', owned: true },
    { id: 'ranking', label: 'Ranking', icon: 'trophy', owned: false },
    { id: 'shop', label: 'Shop', icon: 'chest', owned: false },
    { id: 'chat', label: 'Chat', icon: 'chat', owned: false },
    { id: 'profile', label: 'Perfil', icon: 'user', owned: false },
  ];

  readonly unitTabs: UnitNavItem[] = [
    { id: 'teorico', label: 'Material Teórico', short: 'Teórico', icon: 'pdf', kind: 'reading' },
    { id: 'audiovisual', label: 'Recursos Audiovisuales', short: 'Videos', icon: 'video', kind: 'video' },
    { id: 'apoyo', label: 'Material de Apoyo', short: 'Apoyo', icon: 'folder', kind: 'reading' },
    { id: 'desafio', label: 'Desafíos', short: 'Desafíos', icon: 'quiz', kind: 'quiz' },
  ];

  readonly course = computed(
    () => COURSES.find((item) => item.id === this.id()) ?? COURSES[0],
  );
  readonly units = COURSE_UNITS;
  readonly unit = computed<CourseUnit | null>(
    () => this.units.find((item) => item.id === this.unitId()) ?? null,
  );
  readonly activeTab = computed(
    () => this.courseTabs.find((item) => item.id === this.courseTab()) ?? this.courseTabs[0],
  );
  readonly visibleResources = computed(() => {
    const unit = this.unit();
    if (!unit) return [];
    return unit.resources.filter((resource) => resource.section === this.section());
  });
  readonly activeKind = computed(
    () => this.unitTabs.find((tab) => tab.id === this.section())?.kind ?? 'reading',
  );
  readonly outlineModules = computed<GenericOutlineModule[]>(() =>
    this.units.map((unit) => ({
      id: unit.id,
      label: this.sentence.transform(`${unit.label} · ${unit.title}`),
      lessons: unit.resources.map((resource) => ({
        id: resource.id,
        label: resource.title,
        completed: this.isDone(resource),
      })),
    })),
  );

  sectionCopy(section: ResourceSection): SectionCopy {
    if (section === 'teorico') {
      return { heading: 'Material teórico (PDF / documentos)', empty: 'Esta unidad todavía no tiene apuntes.' };
    }
    if (section === 'audiovisual') {
      return { heading: 'Recursos audiovisuales', empty: 'No hay videos cargados en esta unidad.' };
    }
    if (section === 'apoyo') {
      return { heading: 'Material de apoyo', empty: 'No hay material extra en esta unidad.' };
    }
    return { heading: 'Desafíos', empty: 'No hay desafíos habilitados todavía.' };
  }

  isDone(resource: CourseResource): boolean {
    return this.doneIds()[resource.id] ?? resource.done;
  }

  resourceStatus(resource: CourseResource): ActivityStatus {
    return this.isDone(resource) ? 'completed' : 'not-started';
  }

  sectionDone(unit: CourseUnit, section: ResourceSection): boolean {
    const items = unit.resources.filter((resource) => resource.section === section);
    return items.length > 0 && items.every((resource) => this.isDone(resource));
  }

  unitComplete(unit: CourseUnit): boolean {
    return unit.resources.every((resource) => this.isDone(resource));
  }

  unitStatus(unit: CourseUnit): ActivityStatus {
    if (this.unitComplete(unit)) return 'completed';
    if (unit.resources.some((resource) => this.isDone(resource))) return 'in-progress';
    return 'not-started';
  }

  tagLabel(tag: CourseResource['tags'][number]): string {
    if (tag === 'correccion') return 'Corrección';
    if (tag === 'obligatorio') return 'Obligatorio';
    return 'Opcional';
  }

  tagTone(tag: CourseResource['tags'][number]): 'cyan' | 'red' | 'neutral' {
    if (tag === 'correccion') return 'cyan';
    if (tag === 'obligatorio') return 'red';
    return 'neutral';
  }

  unitHeading(unit: CourseUnit): string {
    return `Unidad ${this.unitNumber(unit)}: ${unit.title}`;
  }

  unitNumber(unit: CourseUnit): string {
    return unit.label.replace('U', '');
  }

  openUnit(unit: CourseUnit): void {
    this.unitId.set(unit.id);
    const first = this.unitTabs.find((tab) =>
      unit.resources.some((resource) => resource.section === tab.id),
    );
    this.section.set(first?.id ?? 'teorico');
    this.selectedResourceId.set(
      unit.resources.find((resource) => resource.section === (first?.id ?? 'teorico'))?.id ?? null,
    );
  }

  onLessonClick(event: { module: GenericOutlineModule; lesson: GenericOutlineLesson }): void {
    const unit = this.units.find((item) => item.id === event.module.id);
    const resource = unit?.resources.find((item) => item.id === event.lesson.id);
    if (!unit || !resource) return;
    this.unitId.set(unit.id);
    this.section.set(resource.section);
    this.selectedResourceId.set(resource.id);
    this.courseTab.set('roadmap');
  }

  backToRoadmap(): void {
    this.unitId.set(null);
    this.selectedResourceId.set(null);
    this.courseTab.set('roadmap');
  }

  toggleDone(resource: CourseResource): void {
    this.doneIds.update((map) => ({
      ...map,
      [resource.id]: !(map[resource.id] ?? resource.done),
    }));
  }
}
