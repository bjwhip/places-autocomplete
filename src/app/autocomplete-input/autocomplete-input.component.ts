import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, NgZone, AfterViewInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss']
})
export class AutocompleteInputComponent implements OnInit, AfterViewInit {
  @ViewChild('autocompleteInput') autocompleteInput!: ElementRef;
  @Output() placeChanged: EventEmitter<any> = new EventEmitter();

  autocomplete: any;

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initAutocomplete();
  }

  initAutocomplete(): void {
    this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.nativeElement, {});

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete.getPlace();
        this.placeChanged.emit(place);
      });
    });
  }
}
