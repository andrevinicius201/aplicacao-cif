import { Component, OnInit } from '@angular/core';
import { EvaluationService } from '../service/evaluation.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-evaluation-list',
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.css']
})
export class EvaluationListComponent implements OnInit {
  public dataSource = [];
  displayedColumns: string[] = ['therapistId', 'therapistName', 'date', 'location', 'view'];
  therapistName = localStorage.name;

  
  constructor(private evaluationService:EvaluationService, private route:Router) { }

  ngOnInit(): void {
    this.evaluationService.evaluationList()
      .subscribe(
        data => {
          this.dataSource = data
        }
      );
  }

  redirectToEvaluationDetails(id) {
    this.route.navigate(['evaluation-details',id]);
  }
}
