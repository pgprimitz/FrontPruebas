import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import {
  GenericBadge,
  GenericButton,
  GenericCard,
  GenericIcon,
  GenericModal,
  GenericProgress,
  GenericSubtitle,
  GenericText,
  GenericTitle,
} from 'generic-ui';
import type { GenericIconName } from 'generic-ui';
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
}

interface SectionCopy {
  heading: string;
  empty: string;
}

@Component({
  selector: 'app-course',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericBadge,
    GenericButton,
    GenericCard,
    GenericIcon,
    GenericModal,
    GenericProgress,
    GenericSubtitle,
    GenericText,
    GenericTitle,
  ],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class CoursePage {
  readonly id = input.required<string>();
  readonly courseTab = signal<CourseTab>('roadmap');
  readonly unitId = signal<string | null>(null);
  readonly section = signal<ResourceSection>('teorico');
  readonly doneIds = signal<Record<string, boolean>>({});
  readonly preview = signal<CourseResource | null>(null);

  readonly courseTabs: CourseNavItem[] = [
    { id: 'roadmap', label: 'Roadmap', icon: 'scroll', owned: true },
    { id: 'ranking', label: 'Ranking', icon: 'trophy', owned: false },
    { id: 'shop', label: 'Shop', icon: 'chest', owned: false },
    { id: 'chat', label: 'Chat', icon: 'chat', owned: false },
    { id: 'profile', label: 'Perfil', icon: 'user', owned: false },
  ];

  readonly unitTabs: UnitNavItem[] = [
    { id: 'teorico', label: 'Material Teórico', short: 'Teórico', icon: 'pdf' },
    { id: 'audiovisual', label: 'Recursos Audiovisuales', short: 'Videos', icon: 'video' },
    { id: 'apoyo', label: 'Material de Apoyo', short: 'Apoyo', icon: 'folder' },
    { id: 'desafio', label: 'Desafíos', short: 'Desafíos', icon: 'quiz' },
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

  sectionDone(unit: CourseUnit, section: ResourceSection): boolean {
    const items = unit.resources.filter((resource) => resource.section === section);
    return items.length > 0 && items.every((resource) => this.isDone(resource));
  }

  unitComplete(unit: CourseUnit): boolean {
    return unit.resources.every((resource) => this.isDone(resource));
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

  unitNumber(unit: CourseUnit): string {
    return unit.label.replace('U', '');
  }

  openUnit(unit: CourseUnit): void {
    this.unitId.set(unit.id);
    const first = this.unitTabs.find((tab) =>
      unit.resources.some((resource) => resource.section === tab.id),
    );
    this.section.set(first?.id ?? 'teorico');
  }

  backToRoadmap(): void {
    this.unitId.set(null);
    this.courseTab.set('roadmap');
  }

  toggleDone(resource: CourseResource): void {
    this.doneIds.update((map) => ({
      ...map,
      [resource.id]: !(map[resource.id] ?? resource.done),
    }));
  }
}
