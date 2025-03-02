import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // showAdminCrud: boolean = false;

  newStoragePlace: string = '';
  storagePlaces: any[] = [];
  selectedStoragePlace: string = '';
  storagePlaceModels = [
    {key:'storage', text:'storage', type: 'string'}
  ];

  newItemName: string = '';
  itemNames: any[] = [];
  updatedItemName: string = '';
  itemNameModels = [
    {key:'item', text:'item', type: 'string'}
  ];
  
  items: any[] = [];
  newItem: any = {
    quantity: 0,
    itemNameId: null,
    storagePlaceId: null,
    description: '',
    itemCode:''
  };
  itemModels = [
    {key: 'item', text:'item', type: 'string'},
    {key: 'storage', text:'storage', type: 'string'},
    {key: 'description', text:'description', type: 'string'},
    {key: 'itemCode', text:'itemCode', type: 'string'}
  ]
  
  constructor(private baseService: BaseService) { }

  ngOnInit(): void {
    this.loadStoragePlaces();
    this.loadItemNames();
    this.loadItems();
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

  //Storage place management

  loadStoragePlaces(): void {
    this.baseService.getStoragePlaces().subscribe(data => {
      this.storagePlaces = data;
      console.log(this.storagePlaces);
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

  deleteStoragePlace(id: number): void {
    this.baseService.deleteStoragePlace(id).subscribe(() => {
      this.loadStoragePlaces();
    });
  }

  //Item name management

  loadItemNames(): void {
    this.baseService.getItemNames().subscribe(data => {
      this.itemNames = data;
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

  updateItemName(id: number, newName: string){
    this.baseService.updateItemName(id, newName ).subscribe(() => {
      this.loadItemNames();
      this.updatedItemName = '';
    });
  }
  
  deleteItemName(id: number): void {
    this.baseService.deleteItemName(id).subscribe(() => {
      this.loadItemNames();
    });
  }

  //Item management
  
  loadItems(): void {
    this.baseService.getItems().subscribe(data => {
      this.items = data;
    });
  }

  createItem(){
    this.baseService.createItem(
      this.newItem.itemNameId,
      this.newItem.storagePlaceId,
      this.newItem.description,
      this.newItem.quantity
    ).subscribe(() => {
      this.loadItems();
      this.newItem = {
        itemNameId: null,
        storagePlaceId: null,
        description: '',
        quantity: 0,
        itemCode: ''
      };
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

  // createItemCode(itemName:string, itemId: number): void {
  //   const paddedId = itemId.toString().padStart(6, '0');
  //   const itemCode = `BZSH-${itemName}-${paddedId}`;
  // }

}