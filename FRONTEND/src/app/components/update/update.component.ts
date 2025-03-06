import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

interface ItemName {
  id: number;
  item: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  items: any[] = [];
  newItem: any = {
    itemNameId: null,
    storagePlaceId: null,
    quantity: 0,
    description: '',
  };

  updatedItem: any = {
    id: null,
    itemNameId: null,
    description:''
  }
  selectedStoragePlace: number = 0;
  storagePlaces: any;
  itemNames: ItemName[] = [];
  newStoragePlaceId: any;
  // itemModels = [
  //   {key: 'item', text:'item', type: 'string'},
  //   {key: 'storage', text:'storage', type: 'string'},
  //   {key: 'description', text:'description', type: 'string'},
  //   {key: 'itemCode', text:'itemCode', type: 'string'}
  // ]
  
  constructor(private baseService: BaseService) { }

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
      console.log(this.items);
    });
  }

  createItem(){
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