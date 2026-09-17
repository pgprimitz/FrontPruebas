import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeamWorkspace } from '../team-workspace';

@Component({
  selector: 'app-team-01',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TeamWorkspace],
  template: '<app-team-workspace teamId="01" />',
})
export class TeamPage {}
