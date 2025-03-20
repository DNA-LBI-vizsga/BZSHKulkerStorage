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

interface Item {
  id: number;
  itemNameId: number;
  storagePlaceId: number
  [key:string]: any;
}

@Component({
  selector: 'app-create',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})

export class ListComponent implements OnInit {

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

  currentPage: number = 1;
  itemsPerPage: number = 10;
 
  constructor(private baseService: BaseService) { }



  ngOnInit(): void {
    this.loadItems();
    this.loadStoragePlaces();
    this.loadItemNames();
  }

  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.items.filter(item => item.storagePlaceId == this.selectedStoragePlace).slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    const allItems = this.items.filter(item => item.storagePlaceId == this.selectedStoragePlace);
    return Math.ceil(allItems.length / this.itemsPerPage);
  }

  getItemName(itemNameId: number): string {
    const item = this.itemNames.find(i => i.id === itemNameId);
    return item ? item.item : 'Unknown';
  }

  getStoragePlaceById(storagePlaceId: number): string {
    const storagePlace = this.storagePlaces.find((s:StoragePlace) => s.id === storagePlaceId);
    return storagePlace ? storagePlace.storage : 'Unknown';
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
    this.baseService.getItems().subscribe((data: Item[]) => {
      this.items = data.map((item: Item) => ({
        ...item,
        productCode: `BZSH-${this.getItemName(item.itemNameId)}-${item.id}`
      }));
      console.log(this.items);
    });
  }

}
