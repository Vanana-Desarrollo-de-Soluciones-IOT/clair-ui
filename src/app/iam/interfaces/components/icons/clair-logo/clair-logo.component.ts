import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clair-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      viewBox="0 0 494 288"
      xmlns="http://www.w3.org/2000/svg"
      [class]="computedClass"
      role="img"
      aria-label="Clair logo"
    >
      <path
        d="M418.538 27.2058C205.038 -15.2944 -53.4615 164.706 58.038 272.706C-143.273 165.971 233.035 -57.294 492.038 15.2064L418.538 27.2058Z"
        [attr.fill]="fill"
        [attr.stroke]="stroke"
        [attr.stroke-width]="strokeWidth"
        stroke-linejoin="round"
      />
      <path
        d="M374.473 27.0005C39.4731 66.5005 20.973 308.772 318.473 234.272L233.471 236.765C326.863 224.017 377.153 210.294 468.475 179.265C361.44 247.172 260.975 286.765 169.975 286.765C78.9749 286.765 24.4746 243.762 55.4748 179.265C118.475 67.262 262.475 22.4905 374.473 27.0005Z"
        [attr.fill]="fill"
        [attr.stroke]="stroke"
        [attr.stroke-width]="strokeWidth"
        stroke-linejoin="round"
      />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClairLogoComponent {
  /**
   * Tailwind classes applied to the root SVG element.
   * Use sizing utilities (e.g. 'w-32 h-auto') and color utilities
   * (e.g. 'text-white' or 'text-primary') since fill/stroke default to currentColor.
   */
  @Input() class = '';

  /** Fill color for both paths. Accepts Tailwind colors when combined with currentColor. */
  @Input() fill: string = 'currentColor';

  /** Stroke color for both paths. Accepts Tailwind colors when combined with currentColor. */
  @Input() stroke: string = 'currentColor';

  /** Stroke width for both paths. */
  @Input() strokeWidth: number | string = 2;

  get computedClass(): string {
    return ['block', this.class].join(' ').trim();
  }
}
