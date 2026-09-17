import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { GenericButton, GenericCard, GenericText, GenericTitle } from 'generic-ui';

@Component({
  selector: 'app-team-workspace',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericButton, GenericCard, GenericText, GenericTitle],
  templateUrl: './team-workspace.html',
  styleUrl: './team-workspace.css',
})
export class TeamWorkspace {
  private readonly router = inject(Router);
  readonly teamId = input.required<string>();
  readonly teams = Array.from({ length: 12 }, (_, index) =>
    String(index + 1).padStart(2, '0'),
  );

  go(id: string): void {
    void this.router.navigate(['/teams', id]);
  }
}
