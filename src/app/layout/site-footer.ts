import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GenericText, GenericTitle } from 'generic-ui';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericText, GenericTitle],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {}
