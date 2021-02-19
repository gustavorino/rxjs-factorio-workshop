import { Component } from '@angular/core';
import { FactorioService } from './factorio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'factorio';

  constructor(public factorio: FactorioService) {}
}
