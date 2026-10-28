/// <reference types="astro/client" />

type Role = 'student' | 'teacher';

interface SessionUser {
  id: string; // UUID
  name: string; // "Sample Student"
  email: string;
  role: Role;
}

declare namespace App {
  interface Locals {
    user: SessionUser | null;
  }
}
