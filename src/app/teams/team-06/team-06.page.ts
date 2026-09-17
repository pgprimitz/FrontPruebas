import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeamWorkspace } from '../team-workspace';

@Component({
  selector: 'app-team-06',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TeamWorkspace],
  template: '<app-team-workspace teamId="06" />',
})
export class TeamPage {}
