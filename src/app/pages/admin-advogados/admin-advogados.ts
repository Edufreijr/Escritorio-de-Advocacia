import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LawyerService } from '../../services/lawyer.service';
import { AreaService } from '../../services/area.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

import { Lawyer } from '../../interfaces/lawyer';

@Component({
  selector: 'app-admin-advogados',
  imports: [FormsModule],
  templateUrl: './admin-advogados.html',
  styleUrl: './admin-advogados.css',
})
export class AdminAdvogados {
  private readonly lawyerService = inject(LawyerService);

  private readonly areaService = inject(AreaService);

  private readonly appointmentService = inject(AppointmentService);

  private readonly authService = inject(AuthService);

  readonly lawyers = this.lawyerService.all;

  showForm = false;
  areaMenuOpen = false;
  editingLawyerId: number | null = null;

  name = '';
  role = 'Advogado(a) Associado(a)';
  oab = '';
  selectedAreas: string[] = [];
  bio = '';
  image = '';
  imagePreview = '';

  get areas() {
    return this.areaService.getAll();
  }

  get availableAreas() {
    return this.areas;
  }

  get totalLawyers(): number {
    return this.lawyers().length;
  }

  getLawyerSpecialties(lawyer: Lawyer): string {
    return lawyer.specialties.join(', ');
  }

  openForm(): void {
    this.clearForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.clearForm();
  }

  editLawyer(lawyer: Lawyer): void {
    this.editingLawyerId = lawyer.id;
    this.name = lawyer.name;
    this.role = lawyer.role;
    this.oab = lawyer.oab;
    this.selectedAreas = [...lawyer.specialties];
    this.bio = lawyer.bio;
    this.image = lawyer.image;
    this.imagePreview = lawyer.image;
    this.areaMenuOpen = false;
    this.showForm = true;
  }

  toggleArea(area: string): void {
    if (this.selectedAreas.includes(area)) {
      this.selectedAreas = this.selectedAreas.filter((item) => item !== area);
      return;
    }

    this.selectedAreas = [...this.selectedAreas, area];
  }

  isAreaSelected(area: string): boolean {
    return this.selectedAreas.includes(area);
  }

  removeSelectedArea(area: string): void {
    this.selectedAreas = this.selectedAreas.filter((item) => item !== area);
  }

  toggleAreaMenu(): void {
    this.areaMenuOpen = !this.areaMenuOpen;
  }

  closeAreaMenu(): void {
    this.areaMenuOpen = false;
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  handleImageDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.processImage(file);
    }
  }

  handleImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.processImage(file);
    input.value = '';
  }

  onFileSelected(event: Event): void {
    this.handleImageSelect(event);
  }

  onImageDrop(event: DragEvent): void {
    this.handleImageDrop(event);
  }

  onImageDragOver(event: DragEvent): void {
    this.handleDragOver(event);
  }

  removeImage(): void {
    this.image = '';
    this.imagePreview = '';
  }

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.style.display = 'none';
  }

  createLawyer(): void {
    const name = this.name.trim();
    const role = this.role.trim();
    const oab = this.oab.trim();
    const bio = this.bio.trim();
    const uniqueAreas = [
      ...new Set(this.selectedAreas.map((area) => area.trim()).filter((area) => area.length > 0)),
    ];

    if (!name || !role || !oab || !bio || uniqueAreas.length === 0) {
      return;
    }

    const data: Omit<Lawyer, 'id'> = {
      name,
      role,
      oab,
      specialties: uniqueAreas,
      bio,
      image: this.image,
    };

    if (this.editingLawyerId !== null) {
      const lawyer = this.lawyerService.updateLawyer(this.editingLawyerId, data);

      if (!lawyer) {
        return;
      }

      this.authService.updateLawyerAccount(lawyer.id, lawyer.name);

      this.appointmentService.removeLawyerAssignmentsOutsideAreas(lawyer.id, lawyer.specialties);

      this.closeForm();
      return;
    }

    const lawyer = this.lawyerService.addLawyer(data);
    const account = this.authService.createLawyerAccount(lawyer.id, lawyer.name);

    if (!account) {
      this.lawyerService.removeLawyer(lawyer.id);
      return;
    }

    this.closeForm();
  }

  removeLawyer(id: number): void {
    const lawyer = this.lawyerService.getById(id);

    if (!lawyer) {
      return;
    }

    const confirmed = confirm(
      `Deseja realmente excluir o advogado ${lawyer.name}? Os agendamentos serão mantidos e ficarão sem advogado.`,
    );

    if (!confirmed) {
      return;
    }

    this.appointmentService.removeLawyerAssignments(id);
    this.authService.removeLawyerAccount(id);
    this.lawyerService.removeLawyer(id);
  }

  private processImage(file: File): void {
    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== 'string') {
        return;
      }

      this.image = result;
      this.imagePreview = result;
    };

    reader.readAsDataURL(file);
  }

  private clearForm(): void {
    this.editingLawyerId = null;
    this.name = '';
    this.role = 'Advogado(a) Associado(a)';
    this.oab = '';
    this.selectedAreas = [];
    this.bio = '';
    this.image = '';
    this.imagePreview = '';
    this.areaMenuOpen = false;
  }
}
