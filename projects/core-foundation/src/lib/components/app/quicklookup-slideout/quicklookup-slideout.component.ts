import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../modules/shared/services/site.service';
@Component({
  selector: 'core-quicklookup-slideout',
  templateUrl: './quicklookup-slideout.component.html',
  styleUrls: ['./quicklookup-slideout.component.css']
})
export class QuicklookupSlideoutComponent implements OnInit {

  companyData: any;
  public defaultItem: { text: string, value: number } = { text: "Select ", value: null };
  selectedComapanyId: number = 1;
  selectedDate: Date;
  selectedPayee: number = 1;
  isOverlayBusy: boolean;
  isOverlayError: boolean;
  errorMessage: boolean;
  searchName: string;
  payeeGridData: any;

  payeeSearchTypeEnum: any;



  constructor(private siteService: SiteService) { }

  ngOnInit() {
    this.getCompanies();
    this.payeeSearchTypeEnum = this.siteService.getSiteJson().constants.enums.reprintcheck.PayeeSearchTypeEnum;
    this.payeeSearchTypeEnum = Object.keys(this.payeeSearchTypeEnum).map(key => ({ text: key, value: this.payeeSearchTypeEnum[key] }));
  }


  getCompanies() {
    this.siteService.getCompanies().subscribe(
      (data: any) => {
        this.companyData = data.companyChoices;
      }, error => {
      })
  }

  getPayeeDetails() {
    this.errorMessage = false;
    this.isOverlayBusy = true;
    if (this.searchName != undefined) {
      this.siteService.getPayeeDetails(this.searchName, this.selectedComapanyId, this.selectedPayee).subscribe(
        (data: any) => {
          this.payeeGridData = data;
          this.isOverlayBusy = false;
          this.isOverlayError = false;
        }, error => {
          this.isOverlayError = true;

        })
    }
    else {
      this.errorMessage = true;
      this.isOverlayBusy = false;
    }
  }
  print() {
    alert('This will be implemented later.')
  }

  errorPopup() {
    this.errorMessage = false;
  }

}
