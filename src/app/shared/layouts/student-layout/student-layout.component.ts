import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { StudentProfileService } from '../../../core/services/student-profile.service';
import { ActivityResultService } from '../../../core/services/activity-result.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css'
})
export class StudentLayoutComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private profileSvc = inject(StudentProfileService);
  private resultSvc = inject(ActivityResultService);

  focusMode = signal(false);
  initials = signal('JP');
  fullName = signal('');
  streak = signal(0);
  level = signal(1);
  xp = signal(0);
  xpTarget = signal(1000);

  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.deepestRouteData())
    ).subscribe(data => this.focusMode.set(!!data['focus']));
    this.focusMode.set(!!this.deepestRouteData()['focus']);

    this.profileSvc.getMyProfile().subscribe({
      next: (p) => {
        const name = `${p.firstName} ${p.lastName}`.trim() || p.email;
        this.fullName.set(name);
        const parts = name.split(' ').filter(Boolean);
        this.initials.set(((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'ES');
      },
      error: () => {}
    });

    this.resultSvc.getMine().subscribe({
      next: (results) => {
        this.computeGamification(results);
      },
      error: () => {}
    });
  }

  private computeGamification(results: { completedAt: string; score: number }[]): void {
    // XP: 10 por cada actividad completada + bono proporcional al puntaje
    const totalXp = results.reduce((acc, r) => acc + 10 + Math.round((r.score || 0) / 10), 0);
    this.xp.set(totalXp);
    this.level.set(1 + Math.floor(totalXp / 200));
    this.xpTarget.set((this.level()) * 200);

    // Racha: días consecutivos con al menos una actividad completada
    const days = new Set(results.map(r => new Date(r.completedAt).toDateString()));
    let streak = 0;
    const cursor = new Date();
    while (days.has(cursor.toDateString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    this.streak.set(streak);
  }

  private deepestRouteData(): Record<string, any> {
    let r = this.route;
    while (r.firstChild) r = r.firstChild;
    return r.snapshot.data;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
