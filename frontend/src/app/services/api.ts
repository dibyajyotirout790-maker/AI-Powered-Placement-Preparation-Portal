import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://ai-powered-placement-preparation-portal-juqep4kyg-place-x.vercel.app/api';

  constructor(private http: HttpClient) {}

  // =========================
  // AUTH
  // =========================

  register(data: any) {
    return this.http.post<any>(
      `${this.baseUrl}/auth/register`,
      data
    );
  }

  login(data: any) {
    return this.http.post<any>(
      `${this.baseUrl}/auth/login`,
      data
    );
  }

  // =========================
  // JOBS
  // =========================

  getJobs() {
    return this.http.get<any[]>(
      `${this.baseUrl}/jobs`
    );
  }

  // =========================
  // INTERVIEW
  // =========================

  generateInterview(
    role: string,
    difficulty: string,
    count: number
  ) {
    return this.http.post<any>(
      `${this.baseUrl}/ai/interview`,
      {
        role,
        difficulty,
        count
      }
    );
  }
}