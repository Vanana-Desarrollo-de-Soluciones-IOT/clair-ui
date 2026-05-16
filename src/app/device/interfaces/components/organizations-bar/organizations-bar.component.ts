import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Organization } from '../../../domain/services/device-query-service';
import { OrganizationId } from '../../../domain/model/valueobjects/organization-id.value-object';

@Component({
  selector: 'app-organizations-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './organizations-bar.component.html',
  styleUrl: './organizations-bar.component.css',
})
export class OrganizationsBarComponent implements OnInit {
  @Input() organizations: Organization[] = [];
  @Input() selectedOrganizationId: OrganizationId | null = null;
  @Input() loadingOrgs = false;
  @Input() errorOrgs = '';
  @Input() spaceCount = 0;

  @Output() organizationSelected = new EventEmitter<OrganizationId>();
  @Output() addOrganizationRequested = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  searchControl = this.fb.control('');

  get filteredOrganizations(): Organization[] {
    const term = this.searchControl.value?.toLowerCase() ?? '';
    if (!term) return this.organizations;
    return this.organizations.filter((o) => o.name.toLowerCase().includes(term));
  }

  ngOnInit(): void {}

  selectOrganization(orgId: OrganizationId): void {
    this.organizationSelected.emit(orgId);
  }

  openAddOrganizationDialog(): void {
    this.addOrganizationRequested.emit();
  }
}