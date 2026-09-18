import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GenericFooter } from 'generic-ui';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericFooter],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {}
