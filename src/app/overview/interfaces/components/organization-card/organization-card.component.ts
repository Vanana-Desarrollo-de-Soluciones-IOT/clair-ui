import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OrganizationAqiItem {
  organizationName?: string | null;
  spaceName: string | null;
  aqiValue: number | null;
  aqiCategory?: string | null;
}

@Component({
  selector: 'app-organizations-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-card.component.html',
  styleUrls: ['./organization-card.component.css'],
})
export class OrganizationCardComponent {
  @Input() title = 'Organizations';
  @Input() organizations: OrganizationAqiItem[] = [];
  @Input() emptyLabel = 'No organizations available';

  get hasOrganizations(): boolean {
    return Array.isArray(this.organizations) && this.organizations.length > 0;
  }

  getAqiValue(value: number | null): string | number {
    return value === null || !Number.isFinite(value) ? '--' : Math.round(value);
  }

  getSpaceName(name: string | null): string {
    return name && name.trim().length > 0 ? name : '--';
  }

  getAqiCategory(category: string | null | undefined): string {
    if (!category || category.trim().length === 0) return '--';
    return category.replace(/_/g, ' ');
  }
}
