import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ApiService, Subject } from '../services/api.service';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ReactiveFormsModule,
  ],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  subjectForm: FormGroup;
  subjects: Subject[] = [];
  loading = false;
  error: string | null = null;
  editingSubject: Subject | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      credits: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.loading = true;
    this.error = null;

    this.apiService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load subjects: ' + (err.error?.error || err.message);
        this.loading = false;
        console.error('Error loading subjects:', err);
      }
    });
  }

  onSubmit() {
    if (!this.subjectForm.valid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.subjectForm.value;

    const subjectData = {
      name: formValue.name,
      code: formValue.code,
      credits: Number(formValue.credits)
    };

    if (this.editingSubject?.id) {

      this.apiService.updateSubject(this.editingSubject.id, subjectData).subscribe({
        next: (updated) => {
          const index = this.subjects.findIndex(s => s.id === updated.id);
          if (index !== -1) this.subjects[index] = updated;

          this.cancelEdit();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to update subject: ' + (err.error?.error || err.message);
          this.loading = false;
          console.error('Error updating subject:', err);
        }
      });

    } else {

      this.apiService.createSubject(subjectData).subscribe({
        next: (created) => {
          this.subjects.push(created);
          this.subjectForm.reset();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to create subject: ' + (err.error?.error || err.message);
          this.loading = false;
          console.error('Error creating subject:', err);
        }
      });

    }
  }

  editSubject(subject: Subject) {
    this.editingSubject = subject;

    this.subjectForm.patchValue({
      name: subject.name,
      code: subject.code,
      credits: subject.credits
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingSubject = null;
    this.subjectForm.reset();
  }

  deleteSubject(subject: Subject) {
    if (!subject.id) return;

    if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
      this.loading = true;
      this.error = null;

      this.apiService.deleteSubject(subject.id).subscribe({
        next: () => {
          this.subjects = this.subjects.filter(s => s.id !== subject.id);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to delete subject: ' + (err.error?.error || err.message);
          this.loading = false;
          console.error('Error deleting subject:', err);
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.subjectForm.get(fieldName);

    if (field?.touched && field.invalid) {
      if (field.errors?.['required']) return 'This field is required';
      if (field.errors?.['minlength']) return 'Minimum length is 2 characters';
      if (field.errors?.['min']) return 'Credits must be at least 1';
    }
    return '';
  }
}
