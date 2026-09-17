import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeamWorkspace } from '../team-workspace';

@Component({
  selector: 'app-team-02',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TeamWorkspace],
  template: '<app-team-workspace teamId="02" />',
})
export class TeamPage {}
