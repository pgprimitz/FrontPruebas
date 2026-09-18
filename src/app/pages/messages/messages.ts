import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  GenericAvatar,
  GenericBadge,
  GenericButton,
  GenericChat,
  GenericInput,
  GenericText,
  GenericTitle,
  SentenceCasePipe,
} from 'generic-ui';
import { CONTACTS, THREADS } from '../../core/mock-data';
import { ChatThread } from '../../core/models';

@Component({
  selector: 'app-messages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericAvatar,
    GenericBadge,
    GenericButton,
    GenericChat,
    GenericInput,
    GenericText,
    GenericTitle,
    SentenceCasePipe,
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  readonly contacts = CONTACTS;
  readonly activeId = signal(CONTACTS[0].id);
  readonly draft = signal('');
  readonly threads = signal<ChatThread[]>(THREADS);

  readonly active = computed(
    () => this.threads().find((thread) => thread.id === this.activeId()) ?? this.threads()[0],
  );

  send(): void {
    const text = this.draft().trim();
    if (!text) return;
    const id = this.activeId();
    this.threads.update((list) =>
      list.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              messages: [...thread.messages, { id: crypto.randomUUID(), text, from: 'me' as const }],
            }
          : thread,
      ),
    );
    this.draft.set('');
  }
}
