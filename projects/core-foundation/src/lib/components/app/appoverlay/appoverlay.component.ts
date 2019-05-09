import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-appoverlay',
  templateUrl: './appoverlay.component.html',
  styleUrls: ['./appoverlay.component.scss']
})
export class AppoverlayComponent implements OnInit {
    @Input() overlayisBusy: boolean;
    @Input() overlayisError: boolean;
    
  constructor() { }

  ngOnInit() {
  }

}
