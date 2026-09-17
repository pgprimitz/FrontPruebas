import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeamWorkspace } from '../team-workspace';

@Component({
  selector: 'app-team-10',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TeamWorkspace],
  template: '<app-team-workspace teamId="10" />',
})
export class TeamPage {}
