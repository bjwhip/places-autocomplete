import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

declare var google: any;

@Component({
  selector: 'app-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
})
export class AutocompleteInputComponent implements OnInit, AfterViewInit{
  @Output() placeChanged: EventEmitter<any> = new EventEmitter();
  
  @ViewChild('searchInput') searchInput!: ElementRef;
  private searchTextChanged = new Subject<string>();

  constructor() { }

  ngOnInit(): void {
    this.loadGoogleMapsApi().then((loaded) => {
      if (loaded) {
        this.initializeAutocomplete();
      }
    });

    this.searchTextChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchText) => this.searchAddress(searchText));
  }

  ngAfterViewInit(): void {
    
  }

  private async loadGoogleMapsApi(): Promise<boolean> {
    try {
      const loader = new Loader({
        apiKey: 'AIzaSyA9PZH2zWK8cpwK0tQYPWzQCOjt8VxbqoI',
        version: 'weekly',
        libraries: ['places'],
      });

      await loader.load();
      return true;
    } catch (error) {
      console.error('Error loading Google Maps API:', error);
      return false;
    }
  }

  private initializeAutocomplete(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.placeChanged.emit(place);
      // console.log('Se:', place);
    });
  }

  public onKeyUp(searchText: any): void {
    this.searchTextChanged.next(searchText.target.value);
  }

  private searchAddress(searchText: string): void {
    if (!searchText) {
      return;
    }

    const autocompleteService = new google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({ input: searchText }, (predictions: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log('Address predictions:', predictions);
      } else {
        console.error('Error retrieving predictions:', status);
      }
    });
  }
}
