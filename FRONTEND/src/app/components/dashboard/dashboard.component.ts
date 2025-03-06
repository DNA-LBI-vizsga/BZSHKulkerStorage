import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // showAdminCrud: boolean = false;
  itemNameId: number = 0;
  storagePlaceId: number = 0;

  newStoragePlace: string = '';
  storagePlaces: any[] = [];
  selectedStoragePlace: number = 0;
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
    itemNameId: null,
    storagePlaceId: null,
    quantity: 0,
    description: '',
  };

  updatedItem: any = {
    id: null,
    itemNameId: null,
    storagePlaceId: null,
    description:''
  }
  // itemModels = [
  //   {key: 'item', text:'item', type: 'string'},
  //   {key: 'storage', text:'storage', type: 'string'},
  //   {key: 'description', text:'description', type: 'string'},
  //   {key: 'itemCode', text:'itemCode', type: 'string'}
  // ]
  
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
      console.log(this.items);
    });
  }

  createItem(){
    this.baseService.createItem(
      this.newItem.itemNameId,
      this.newItem.storagePlaceId,
      this.newItem.quantity,
      this.newItem.description
    ).subscribe(() => {
      this.loadItems();
      this.newItem = {
        itemNameId: null,
        storagePlaceId: null,
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
}