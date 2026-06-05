import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NOTIFICATIONS_CONTEXT_FACADE, NotificationsContextFacade } from './notifications/interfaces/acl/notifications-context-facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly notificationsContextFacade = inject(NOTIFICATIONS_CONTEXT_FACADE) as NotificationsContextFacade;

  ngOnInit(): void {
    this.notificationsContextFacade.initOneSignal();
  }
}
