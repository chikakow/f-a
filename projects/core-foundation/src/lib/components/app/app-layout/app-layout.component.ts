import { Component, OnInit, Input } from '@angular/core';
import { SiteService } from '../../../modules/shared/services/site.service';

@Component({
  selector: 'lib-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  sidebar: boolean;
  isShowChrome: boolean
  constructor(private siteService: SiteService) { }
  ngOnInit() {
    this.isShowChrome = true;
    this.siteService.getSidemargin().subscribe((data) => {
      this.sidebar = data;
    });
  }

}


