import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeamWorkspace } from '../team-workspace';

@Component({
  selector: 'app-team-05',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TeamWorkspace],
  template: '<app-team-workspace teamId="05" />',
})
export class TeamPage {}
