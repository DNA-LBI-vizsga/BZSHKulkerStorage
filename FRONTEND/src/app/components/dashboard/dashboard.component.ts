import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  storagePlaces: any[] = [];
  values: any[] = [];
  itemNames: any[] = [];

  updatedItemName: string = '';

  newStoragePlace: string = '';
  newItemName: string = '';
  newValue: string = '';
  newItem: any = {
    quantity: 0,
    item_name: '',
    value: '',
    storage_place: '',
    description: ''
  };

  constructor(private baseService: BaseService) { }

  ngOnInit(): void {
    this.loadStoragePlaces();
    this.loadValues();
    this.loadItemNames();
  }

  isAdmin(): boolean {
    const token = this.baseService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin;
    }
    return false;
  }

  loadStoragePlaces(): void {
    this.baseService.getStoragePlaces().subscribe(data => {
      this.storagePlaces = data;
      console.log(this.values)
    });
  }

  loadValues(): void {
    this.baseService.getValues().subscribe(data => {
      this.values = data;
      console.log(this.values)
    });
  }

  loadItemNames(): void {
    this.baseService.getItemNames().subscribe(data => {
      this.itemNames = data;
      console.log(this.itemNames)
    });
  }

  createStoragePlace(): void {
    this.baseService.createStoragePlace(this.newStoragePlace).subscribe(() => {
      this.loadStoragePlaces();
      this.newStoragePlace = '';
    });
  }

  createItemName(): void {
    this.baseService.createItemName(this.newItemName).subscribe(() => {
      this.loadItemNames();
      this.newItemName = '';
    });
  }

  // createValue(): void {
  //   this.baseService.createValue(this.newValue).subscribe(() => {
  //     this.loadValues();
  //     this.newValue = '';
  //   });
  // }

  createItem(): void {
    this.baseService.createItem(
      this.newItem.quantity,
      this.newItem.item_name,
      this.newItem.value,
      this.newItem.storage_place,
      this.newItem.description
    ).subscribe(() => {
      this.newItem = {
        quantity: 0,
        item_name: '',
        value: '',
        storage_place: '',
        description: ''
      };
    });
  }

  updateItemName(id: number, newName: string) {
    this.baseService.updateItemName(id, newName).subscribe(() => {
      this.loadItemNames();
      this.updatedItemName = '';
    });
  }

  deleteStoragePlace(id: number): void {
    this.baseService.deleteStoragePlace(id).subscribe(() => {
      this.loadStoragePlaces();
    });
  }

  deleteItemName(id: number): void {
    this.baseService.deleteItemName(id).subscribe(() => {
      this.loadItemNames();
    });
  }
}