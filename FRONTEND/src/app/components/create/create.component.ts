import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

interface ItemName {
  id: number;
  item: string;
}

interface StoragePlace {
  id: number;
  storage: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  items: any[] = [];
  newItem: any = {
    itemNameId: null,
    storagePlaceId: null,
    quantity: 0,
    description: '',
  };

  newStoragePlaceId: any;
  selectedStoragePlace: number = 0;
  storagePlaces: StoragePlace[] = [];

  itemNames: ItemName[] = [];

  deleteQuantity:any;
  deleteItemModal: any = {
    deleteItemNameId: null,
    deleteStoragePlaceId: null,
    deleteDescription: '',
    deleteQuantity: null
  };

  moveQuantity: any;
  updatedItemModal: any = {
    itemNameId: null,
    storagePlaceId: null,
    description: '',
    quantity: 0
  }
 
  constructor(private baseService: BaseService) { }

  loadDeleteItemModal(itemNameId: number, storagePlaceId: number, description: string, quantity:number): void {
    this.deleteItemModal = {
      deleteItemNameId: itemNameId,
      deleteStoragePlaceId: storagePlaceId,
      deleteDescription: description,
      deleteQuantity: quantity

    };
  }

  loadUpdatedItemModal(itemNameId: number, storagePlaceId: number, description: string, quantity:number): void {
    this.updatedItemModal = {
      itemNameId: itemNameId,
      storagePlaceId: storagePlaceId,
      description: description,
      quantity: quantity
    };
  }
  ngOnInit(): void {
    this.loadItems();
    this.loadStoragePlaces();
    this.loadItemNames();
  }

  //Admin status check

  isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin;
    }
    return false;
  }

  getItemNameById(itemNameId: number): string {
    const item = this.itemNames.find((i:ItemName) => i.id === itemNameId);
    return item ? item.item : 'Unknown';
  }

  getStoragePlaceById(storagePlaceId: number): string {
    // console.log('Storage Place ID:', storagePlaceId);
    // console.log('selected id',this.selectedStoragePlace);
    const storagePlace = this.storagePlaces.find((s:StoragePlace) => s.id === storagePlaceId);
    return storagePlace ? storagePlace.storage : 'Unknown';
  }

  loadStoragePlaces(): void {
    this.baseService.getStoragePlaces().subscribe(data => {
      this.storagePlaces = data;
      // console.log(this.storagePlaces);
    });
  }

  loadItemNames(): void {
    this.baseService.getItemNames().subscribe(data => {
      this.itemNames = data;
      // console.log(this.itemNames);
    });
  }
  
  loadItems(): void {
    this.baseService.getItems().subscribe(data => {
      this.items = data;
      // console.log(this.items);
    });
  }

  createItem(){
    if(this.newItem.quantity === 0 || this.newItem.itemNameId === null) {
      alert("A termék típus és a mennyiségi mező nem lehet üres! Kérjük, adjon meg egy érvényes értékeket.");
      return;
    }

    this.baseService.createItem(
      this.newItem.itemNameId,
      this.selectedStoragePlace,
      this.newItem.quantity,
      this.newItem.description
    ).subscribe(() => {
      this.loadItems();
      this.newItem = {
        itemNameId: null,
        quantity: 0,
        description: '',
      };
    });
  }

  deleteItem(itemNameId: number, storagePlaceId: number, description:string, quantity:number): void {
    this.baseService.deleteItem(itemNameId,storagePlaceId,description,quantity).subscribe(() => {
      this.loadItems();
    });
  }

  updateItem(storagePlaceId: number, itemNameId: number, newStoragePlaceId: number,description:string, quantity: number): void {
    this.baseService.updateItem(storagePlaceId, itemNameId, newStoragePlaceId, description, quantity).subscribe(() => {
      this.loadItems();
    });
  }
}
