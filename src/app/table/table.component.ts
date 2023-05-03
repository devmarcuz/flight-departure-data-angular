import { Component, Input } from '@angular/core';
import { Flight } from '../Flight';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() flights!: Flight[];
  @Input() currentPosts!: Flight[];
  @Input() loading!: boolean;
}
