import { Component, input } from '@angular/core';

@Component({
  selector: 'app-collection-stats',
  standalone: true,
  templateUrl: './collection-stats.html',
  styleUrl: './collection-stats.css',
})
export class CollectionStatsComponent {
  topicCount = input<number>(0);
  groupCount = input<number>(0);
  activityCount = input<number>(0);
}
