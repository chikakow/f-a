import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'core-core-foundation',
  template: `
                <p>
                    core-foundation works!
                    <button kendoButton [icon]="'folder'" [primary]="true">Click for Core-Foundation</button>
                </p>
            `,
  styles: []
})

export class CoreFoundationComponent implements OnInit {

    constructor( ) { }

    ngOnInit() { }

}
