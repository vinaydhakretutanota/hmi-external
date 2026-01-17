// abcggj.component.ts

import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

/*
  Features:
  - EMI Calculator: Enter loan amount, interest rate, and tenure to calculate monthly EMI, total payment, and total interest.
  - Data Persistence: All input data is saved in local storage for your convenience.
  - Download/Upload: Easily backup or restore your calculation data with download/upload buttons.
  - Responsive UI: Clean, modern layout using Bootstrap 5, with intuitive icons for actions.
*/

@Component({
  selector: 'app-abcggj',
  template: `
    <div class="card shadow-sm my-4">
      <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <span>
          <i class="pi pi-calculator me-2"></i>
          EMI Calculator
        </span>
        <div>
          <button class="btn btn-light btn-sm me-2" (click)="downloadData()" title="Download Data">
            <i class="pi pi-download"></i>
          </button>
          <label class="btn btn-light btn-sm mb-0" title="Upload Data">
            <i class="pi pi-upload"></i>
            <input type="file" accept=".txt" hidden (change)="uploadData($event)">
          </label>
        </div>
      </div>
      <div class="card-body">
        <form (ngSubmit)="calculateEMI()" autocomplete="off">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Loan Amount</label>
              <div class="input-group">
                <span class="input-group-text"><i class="pi pi-dollar"></i></span>
                <input type="number" min="1" class="form-control" [(ngModel)]="loanAmount" name="loanAmount" required (change)="saveData()">
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Interest Rate (% per annum)</label>
              <div class="input-group">
                <span class="input-group-text"><i class="pi pi-percentage"></i></span>
                <input type="number" min="0.01" step="0.01" class="form-control" [(ngModel)]="interestRate" name="interestRate" required (change)="saveData()">
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Tenure (months)</label>
              <div class="input-group">
                <span class="input-group-text"><i class="pi pi-clock"></i></span>
                <input type="number" min="1" class="form-control" [(ngModel)]="tenure" name="tenure" required (change)="saveData()">
              </div>
            </div>
          </div>
          <div class="mt-4 d-flex justify-content-end">
            <button type="submit" class="btn btn-success px-4">
              <i class="pi pi-check-circle me-2"></i>Calculate
            </button>
          </div>
        </form>

        <div *ngIf="emiResult !== null" class="mt-5">
          <h5 class="mb-3"><i class="pi pi-chart-bar me-2"></i>Results</h5>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Monthly EMI
              <span class="fw-bold text-primary">{{ emiResult?.emi | number:'1.2-2' }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Total Payment
              <span class="fw-bold">{{ emiResult?.totalPayment | number:'1.2-2' }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Total Interest
              <span class="fw-bold text-danger">{{ emiResult?.totalInterest | number:'1.2-2' }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      max-width: 700px;
      margin: auto;
    }
    .input-group-text i {
      font-size: 1rem;
    }
    @media (max-width: 767px) {
      .card {
        margin: 1rem;
      }
    }
  `]
})
export class AbcggjComponent extends CommonExternalComponent {
  loanAmount: number = 100000;
  interestRate: number = 8.5;
  tenure: number = 60;
  emiResult: { emi: number; totalPayment: number; totalInterest: number } | null = null;

  private readonly LS_KEY = 'abcggj-emi-data';

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.loadData();
    this.calculateEMI();
  }

  saveData(): void {
    const data = {
      loanAmount: this.loanAmount,
      interestRate: this.interestRate,
      tenure: this.tenure
    };
    localStorage.setItem(this.LS_KEY, JSON.stringify(data));
  }

  loadData(): void {
    const dataStr = localStorage.getItem(this.LS_KEY);
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr) as { loanAmount: number; interestRate: number; tenure: number };
        this.loanAmount = data.loanAmount ?? this.loanAmount;
        this.interestRate = data.interestRate ?? this.interestRate;
        this.tenure = data.tenure ?? this.tenure;
      } catch {}
    }
  }

  calculateEMI(): void {
    // EMI Formula: [P x R x (1+R)^N] / [(1+R)^N – 1]
    const P: number = Number(this.loanAmount);
    const annualRate: number = Number(this.interestRate);
    const N: number = Number(this.tenure);

    if (P > 0 && annualRate > 0 && N > 0) {
      const R: number = annualRate / 12 / 100;
      const emi: number = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      const totalPayment: number = emi * N;
      const totalInterest: number = totalPayment - P;
      this.emiResult = {
        emi: emi,
        totalPayment: totalPayment,
        totalInterest: totalInterest
      };
    } else {
      this.emiResult = null;
    }
    this.saveData();
  }

  downloadData(): void {
    const data = {
      loanAmount: this.loanAmount,
      interestRate: this.interestRate,
      tenure: this.tenure
    };
    this.componentDataDownloader(data);
  }

  async uploadData(event: Event): Promise<void> {
    const result = await this.componentDataUploader(event);
    if (result) {
      this.loanAmount = result.loanAmount ?? this.loanAmount;
      this.interestRate = result.interestRate ?? this.interestRate;
      this.tenure = result.tenure ?? this.tenure;
      this.saveData();
      this.calculateEMI();
      this.cdr.detectChanges();
    }
  }
}