import { Component } from '@angular/core';
import { ConfigToolService } from './configuration-tool/config-tool-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ConfigToolService]
})
export class AppComponent {
  title = 'app';
  jsonToShow: string = "";

  constructor(private _configToolService: ConfigToolService) {

  }

  onWorkType() {
    this.jsonToShow = this._configToolService.getWorkType();
    console.log(this.jsonToShow);
  }

  onForms() {
    this.jsonToShow = this._configToolService.getForms();
    console.log(this.jsonToShow);
  }

  onSections() {
    this.jsonToShow = this._configToolService.getSections();
    console.log(this.jsonToShow);
  }

  onSectionToForms() {
    this.jsonToShow = this._configToolService.getSectionToForms();
    console.log(this.jsonToShow);
  }

  onFields() {
    this.jsonToShow = this._configToolService.getFields();
    console.log(this.jsonToShow);
  }

  onOptions() {
    this.jsonToShow = this._configToolService.getOptions();
    console.log(this.jsonToShow);
  }

  
}
