import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfigToolService } from './config-tool-service';

@Component({
  templateUrl: './tool-component.component.html',
  styleUrls: ['./tool-component.component.css'],
  providers: [ConfigToolService],
  encapsulation: ViewEncapsulation.None
})
export class ToolComponent implements OnInit {
  title = 'app';
  jsonToShow: string = "";
  constructor(private _configToolService: ConfigToolService) { }

  ngOnInit() {
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
