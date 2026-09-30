import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  skills: string[];
  description: string;
}

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css'
})
export class Jobs {

  loading = false;
  errorMessage = '';
  appliedJobs: number[] = [];

  jobs: Job[] = [
    {
      id: 1,
      title: 'Full Stack Developer',
      company: 'TechNova Solutions',
      location: 'Bangalore, India',
      type: 'Full Time',
      experience: '0-2 Years',
      salary: '₹5 - ₹8 LPA',
      skills: ['Angular', 'Node.js', 'MongoDB', 'JavaScript'],
      description:
        'Build and maintain modern web applications using MEAN stack technologies.'
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'InnovateTech',
      location: 'Hyderabad, India',
      type: 'Full Time',
      experience: '0-2 Years',
      salary: '₹4 - ₹7 LPA',
      skills: ['HTML', 'CSS', 'JavaScript', 'Angular'],
      description:
        'Develop responsive and user-friendly frontend applications.'
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'CloudCore Technologies',
      location: 'Pune, India',
      type: 'Full Time',
      experience: '0-2 Years',
      salary: '₹5 - ₹9 LPA',
      skills: ['Node.js', 'Express.js', 'MongoDB', 'REST API'],
      description:
        'Develop scalable backend services and REST APIs for web applications.'
    },
    {
      id: 4,
      title: 'Software Engineer',
      company: 'NextGen Systems',
      location: 'Bangalore, India',
      type: 'Full Time',
      experience: 'Fresher',
      salary: '₹4 - ₹6 LPA',
      skills: ['Java', 'DSA', 'OOP', 'SQL'],
      description:
        'Work on software development, problem solving and application maintenance.'
    },
    {
      id: 5,
      title: 'Graduate Software Trainee',
      company: 'Deloitte',
      location: 'Multiple Locations',
      type: 'Full Time',
      experience: 'Fresher',
      salary: '₹4 - ₹7 LPA',
      skills: ['Java', 'Python', 'SQL', 'Problem Solving'],
      description:
        'Join a technology team and work on enterprise software solutions.'
    },
    {
      id: 6,
      title: 'Web Developer Intern',
      company: 'StartupHub',
      location: 'Remote',
      type: 'Internship',
      experience: 'Fresher',
      salary: '₹15,000 - ₹25,000/month',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      description:
        'Gain practical experience by developing real-world web applications.'
    }
  ];

  constructor() {
    this.loadAppliedJobs();
  }

  loadAppliedJobs(): void {
    const stored = localStorage.getItem('placedx_applied_jobs');

    if (stored) {
      try {
        this.appliedJobs = JSON.parse(stored);
      } catch {
        this.appliedJobs = [];
      }
    }
  }

  applyJob(job: Job): void {

    if (this.appliedJobs.includes(job.id)) {
      alert(`You have already applied for ${job.title}.`);
      return;
    }

    this.appliedJobs.push(job.id);

    localStorage.setItem(
      'placedx_applied_jobs',
      JSON.stringify(this.appliedJobs)
    );

    alert(
      `Application submitted successfully!\n\n${job.title} at ${job.company}`
    );
  }

  isApplied(jobId: number): boolean {
    return this.appliedJobs.includes(jobId);
  }
}