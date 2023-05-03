import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Flight } from '../Flight';
import { FlightService } from '../services/flight.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  @Input() postsPerPage!: number;
  @Input() currentPage!: number;
  @Output() paginate = new EventEmitter<number>();
  @Input() flights!: Flight[];
  @Input() totalPosts!: number;
  @Input() loading!: boolean;
  pageNumber: number = 1;
  pageLimit: number = 5;
  maxPageNumberLimit: number = 5;
  minPageNumberLimit: number = 0;
  pageNumbers: any = [];
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  constructor(private flightApi: FlightService) {}

  ngOnInit(): void {
    this.flightApi.fetchFlights().subscribe(() => {
      this.loop();
    });
  }

  loop() {
    for (let i = 1; i <= Math.ceil(this.totalPosts / this.postsPerPage); i++) {
      this.pageNumbers = [...this.pageNumbers, i];
    }
  }

  handleNextBtn = () => {
    if (this.pageNumber >= this.pageNumbers[this.pageNumbers.length - 1]) {
      return;
    }
    this.paginate.emit(this.pageNumber + 1);
    this.pageNumber = this.pageNumber + 1;

    if (this.currentPage + 1 > this.maxPageNumberLimit) {
      this.maxPageNumberLimit = this.maxPageNumberLimit + this.pageLimit;
      this.minPageNumberLimit = this.minPageNumberLimit + this.pageLimit;
    }
  };

  handlePrevBtn = () => {
    if (this.pageNumber <= 1) {
      return;
    }
    this.paginate.emit(this.pageNumber - 1);
    this.pageNumber = this.pageNumber - 1;

    if ((this.currentPage - 1) % this.pageLimit === 0) {
      this.maxPageNumberLimit = this.maxPageNumberLimit - this.pageLimit;
      this.minPageNumberLimit = this.minPageNumberLimit - this.pageLimit;
    }
  };
}
