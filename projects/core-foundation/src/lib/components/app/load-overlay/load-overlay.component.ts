import { Component, OnInit, OnDestroy, AfterViewInit, DoCheck } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadOverlayService } from '../../../services/load-overlay.service';
import { ILoadOverlay } from '../../../interfaces/i-load-overlay';

@Component({
    selector: 'core-load-overlay',
    template: `       
      <div ats-overlay="dataItem.detailsOverlay" class="overlay-target" ats-focus-id="5" [class.hidden]="!show">    
        <div class="overlay-blocker">
            <div class="overlay-content">
                <div>
                    <i class="fa fa-circle-o-notch fa-4x fa-spin"></i>
                </div>
            </div>
        </div>
    </div>

    `,
    styles: [`
        .hidden {
            visibility: hidden;
        }
        .nothidden {
            visibility: normal;
        }
        
        .l-overlay {
            position:absolute;
            height:100%;
            width:100%;
            left:0px;
            top:0px;
            z-Index:30000;
            border:1px solid red;
            background-color:blue;
            color:yellow;
            font-weight:bold;opacity:0.3;
            text-align:center;
            display:grid;
            align-items:center;
        }       
    `]
})
export class LoadOverlayComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
    show = false;
    private subscription: Subscription;

    constructor(
        private loadOverlayService: LoadOverlayService
    ) { }

    ngOnInit(): void {
        this.show = true;
    }

    ngDoCheck(): void {
        this.subscription = this.loadOverlayService.loaderState
            .subscribe((state: ILoadOverlay) => {
                this.show = state.show;
                this.ngOnDestroy();
            });
    }
    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();

    }
}
