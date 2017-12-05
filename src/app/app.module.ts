import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ToolModule } from './configuration-tool/tool.module';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';



@NgModule({
    declarations: [
        AppComponent,
        WelcomeComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot([
            { path: 'welcome', component: WelcomeComponent },
            { path: '', component: WelcomeComponent }
        ]),
        CommonModule,
        ToolModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
