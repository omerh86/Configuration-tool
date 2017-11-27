import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToolComponent } from './tool-component.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterModule.forChild([
      {path:'tool',component:ToolComponent}
    ])

  ],
  declarations: [
    ToolComponent
  ]
})
export class ToolModule { }
