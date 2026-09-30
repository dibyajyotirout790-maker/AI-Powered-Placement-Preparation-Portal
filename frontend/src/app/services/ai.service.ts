import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private baseUrl = 'http://ai-powered-placement-preparation-portal-juqep4kyg-place-x.vercel.app/api/ai';

  constructor(private http: HttpClient) {}

  generateInterview(
    role: string,
    difficulty: string,
    count: number
  ) {

    return this.http.post<any>(
      `${this.baseUrl}/interview`,
      {
        role,
        difficulty,
        count
      }
    );
  }

  evaluateAnswer(
    question: string,
    answer: string
  ) {

    return this.http.post<any>(
      `${this.baseUrl}/evaluate`,
      {
        question,
        answer
      }
    );
  }

  chat(message: string) {

    return this.http.post<any>(
      `${this.baseUrl}/chat`,
      {
        message
      }
    );
  }
}