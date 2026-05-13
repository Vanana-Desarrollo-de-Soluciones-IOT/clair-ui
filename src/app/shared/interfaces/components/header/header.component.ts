import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClairLyricsComponent } from '../clair-lyrics/clair-lyrics.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ClairLyricsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() isSidebarOpen = true;
  @Output() sidebarToggleRequested = new EventEmitter<void>();

  onToggleSidebar(): void {
    this.sidebarToggleRequested.emit();
  }
}
