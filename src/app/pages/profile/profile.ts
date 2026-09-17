import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GenericStat } from 'generic-ui';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericStat],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {}
