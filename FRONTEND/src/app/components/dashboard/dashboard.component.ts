import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  storagePlaces: any[] = [];

  itemNames: any[] = [];

  items: any[] = [];

  updatedItemName: string = '';
  updatedItemQuantity: number = 0;

  newStoragePlace: string = '';
  newItemName: string = '';
  newItem: any = {
    quantity: 0,
    itemNameId: null,
    storagePlaceId: null,
    description: ''
  };

  constructor(private baseService: BaseService) { }

  ngOnInit(): void {
    this.loadStoragePlaces();
    this.loadItemNames();
    this.loadItems();
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin;
    }
    return false;
  }

  loadStoragePlaces(): void {
    this.baseService.getStoragePlaces().subscribe(data => {
      this.storagePlaces = data;
    });
  }

  loadItemNames(): void {
    this.baseService.getItemNames().subscribe(data => {
      this.itemNames = data;
    });
  }

  loadItems(): void {
    this.baseService.getItems().subscribe(data => {
      this.items = data;
    });
  }

  createStoragePlace(): void {
    if (!this.newStoragePlace || this.newStoragePlace.trim() === '') {
      alert('Storage place name cannot be blank');
      return;
    }
    this.baseService.createStoragePlace(this.newStoragePlace).subscribe(() => {
      this.loadStoragePlaces();
      this.newStoragePlace = '';
    });
  }

  createItemName(): void {
    if (!this.newItemName || this.newItemName.trim() === '') {
      alert('Item name cannot be blank');
      return;
    }
    this.baseService.createItemName(this.newItemName).subscribe(() => {
      this.loadItemNames();
      this.newItemName = '';
    });
  }

  createItem(){
    this.baseService.createItem(
      this.newItem.itemNameId,
      this.newItem.storagePlaceId,
      this.newItem.description,
      this.newItem.quantity
    ).subscribe(() => {
      //this.loadItems();
      this.newItem = {
        itemNameId: null,
        storagePlaceId: null,
        description: '',
        quantity: 0
      };
    });
  }

  updateItemName(id: number, newName: string){
    this.baseService.updateItemName(id, newName ).subscribe(() => {
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

  deleteItem(id: number): void {
    this.baseService.deleteItem(id).subscribe(() => {
      this.loadItems();
    });
  }

  updateItem(id: number, storagePlaceId: number, itemNameId: number, description: string): void {
    this.baseService.updateItem(id, storagePlaceId, itemNameId, description).subscribe(() => {
      this.loadItems();
    });
  }
}