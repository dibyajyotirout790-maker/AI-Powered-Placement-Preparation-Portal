import { Component } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TitleCasePipe
  ],
  templateUrl: './interview.html',
  styleUrl: './interview.css'
})
export class Interview {

  role = 'Full Stack Developer';
  difficulty = 'medium';
  questionCount = 5;

  questions: string[] = [];

  currentQuestion = 0;

  loading = false;
  aiGenerating = false;

  errorMessage = '';

  constructor(
    private aiService: AiService
  ) {}


  generateInterview(): void {

    if (this.loading) {
      return;
    }

    this.errorMessage = '';
    this.currentQuestion = 0;

    /*
     * STEP 1
     * Show questions immediately.
     */

    const fallbackQuestions =
      this.getFallbackQuestions();

    this.questions =
      fallbackQuestions.slice(
        0,
        this.questionCount
      );

    /*
     * The interface is now usable immediately.
     */

    this.loading = false;
    this.aiGenerating = true;


    /*
     * STEP 2
     * Ask AI in background.
     */

    this.aiService.generateInterview(
      this.role,
      this.difficulty,
      this.questionCount
    ).subscribe({

      next: (response: any) => {

        let generated: string[] = [];

        if (
          Array.isArray(
            response?.questions
          )
        ) {

          generated =
            response.questions;

        } else if (
          typeof response?.questions === 'string'
        ) {

          generated =
            response.questions
              .split('\n')
              .map(
                (q: string) =>
                  q
                    .replace(
                      /^\d+[\.\)]\s*/,
                      ''
                    )
                    .trim()
              )
              .filter(
                (q: string) =>
                  q.length > 10
              );
        }


        /*
         * Replace fallback questions
         * only if AI returned valid questions.
         */

        if (generated.length > 0) {

          this.questions =
            generated.slice(
              0,
              this.questionCount
            );

          this.currentQuestion = 0;
        }

        this.aiGenerating = false;

      },

      error: (error) => {

        console.error(
          'AI generation failed:',
          error
        );

        /*
         * Keep the fallback questions.
         * User can continue the interview.
         */

        this.aiGenerating = false;

      }

    });

  }


  getFallbackQuestions(): string[] {

    const role =
      this.role.toLowerCase();


    if (
      role.includes('full stack')
    ) {

      return [

        'What is the difference between frontend and backend development?',

        'Explain REST API and how it is used in a full stack application.',

        'What is the difference between SQL and MongoDB?',

        'Explain JWT authentication and how it works.',

        'What is the difference between Angular and React?',

        'What is Node.js and why is it used in backend development?',

        'Explain the MVC architecture.',

        'What is middleware in Express.js?',

        'What is MongoDB and how is it different from SQL databases?',

        'Explain the difference between authentication and authorization.'

      ];

    }


    if (
      role.includes('software')
    ) {

      return [

        'What are the four pillars of object-oriented programming?',

        'What is the difference between an array and a linked list?',

        'Explain time complexity with an example.',

        'What is the difference between process and thread?',

        'What is a REST API?',

        'What is inheritance in object-oriented programming?',

        'Explain polymorphism with an example.',

        'What is a stack and where is it used?',

        'What is a queue?',

        'What is the difference between compiler and interpreter?'

      ];

    }


    return [

      'Tell me about yourself and your technical background.',

      'Explain one of your major projects.',

      'What programming language are you most comfortable with?',

      'Explain the difference between frontend and backend.',

      'What is an API and why is it used?',

      'What are your strongest technical skills?',

      'Explain a difficult problem you solved.',

      'What is object-oriented programming?',

      'What is a database?',

      'Where do you see yourself as a software developer?'

    ];

  }


  nextQuestion(): void {

    if (
      this.currentQuestion <
      this.questions.length - 1
    ) {

      this.currentQuestion++;

    }

  }


  previousQuestion(): void {

    if (
      this.currentQuestion > 0
    ) {

      this.currentQuestion--;

    }

  }

}