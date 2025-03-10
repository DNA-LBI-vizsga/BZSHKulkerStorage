import { Component } from '@angular/core';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
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

  constructor(private baseService: BaseService) { }

  ngOnInit(): void {
    this.loadStoragePlaces();
    this.loadItemNames();
  }

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

}
