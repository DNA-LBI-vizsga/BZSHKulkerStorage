import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

interface Item {
  id: number;
  itemNameId: number;
  storagePlaceId: number
  [key:string]: any;
}

@Component({
  selector: 'app-create',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Properties
  items: Item[] = [];
  storagePlaces: any[] = [];
  itemNames: any[] = [];
  selectedItemIds: number[] = [];
  selectedStoragePlace: number = 0;
  newStoragePlaceId: any;

  newItem: any = {
    itemNameId: null,
    storagePlaceId: null,
    quantity: 0,
    description: '',
  };

  updatedItemModal: any = {
    storagePlaceId: null,
    newStoragePlaceId: null
  };

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Constructor
  constructor(private baseService: BaseService) {}

  // Pagination Methods
  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.items.filter(item => item.storagePlaceId == this.selectedStoragePlace).slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.clearSelection();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.clearSelection();
    }
  }

  get totalPages(): number {
    const allItems = this.items.filter(item => item.storagePlaceId == this.selectedStoragePlace);
    return Math.ceil(allItems.length / this.itemsPerPage);
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    this.loadItemNames();
    this.loadStoragePlaces();
    this.loadItems();
  }

  filteredItems: Item[] = [];
  searchItems(searchTerm:string): void {
    if(searchTerm){
    this.filteredItems = this.items.filter(item => this.getItemName(item.itemNameId).includes(searchTerm)||['item.productCode'].includes(searchTerm));
    }
  }

  // Utility Methods

   getItemName(itemNameId: number): string {
    const item = this.itemNames.find(i => i.id === itemNameId);
    return item ? item.item : 'Unknown';
  }

  // Data Loading Methods
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

  // loadItems(): void {
  //   this.baseService.getItems().subscribe(data => {
  //     this.items = data;
  //     console.log(this.items);
  //   });
  // }

  // Admin Check
  isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin;
    }
    return false;
  }

  // CRUD Operations
  createItem(): void {
    if (this.newItem.quantity === 0 || this.newItem.itemNameId === null) {
      alert("A termék típus és a mennyiségi mező nem lehet üres! Kérjük, adjon meg egy érvényes értékeket.");
      return;
    }

    this.baseService.createItem(
      this.newItem.itemNameId,
      this.selectedStoragePlace,
      this.newItem.quantity
    ).subscribe(() => {
      this.loadItems();
      this.newItem = { itemNameId: null, quantity: 0 };
    });
  }

  deleteItem(itemIdList: number[], storagePlaceId: number): void {
    this.baseService.deleteItem(itemIdList, storagePlaceId).subscribe(() => {
      this.loadItems();
      this.clearSelection();
    });
  }

  updateItem(itemIdList: number[], storagePlaceId: number, newStoragePlaceId: number): void {
    this.baseService.updateItem(itemIdList, storagePlaceId, newStoragePlaceId).subscribe(() => {
      this.loadItems();
      this.clearSelection();
    });
  }

  // Selection Management
  clearSelection(): void {
    this.selectedItemIds = [];
    this.resetSelectAllCheckbox();
  }

  resetSelectAllCheckbox(): void {
    const selectAllCheckbox = document.querySelector('.form-check-input[type="checkbox"]') as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
    }
  }

  toggleItemSelection(event: Event, itemId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedItemIds.push(itemId);
    } else {
      this.selectedItemIds = this.selectedItemIds.filter(id => id !== itemId);
    }
    console.log(this.selectedItemIds);
  }


  toggleSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const toggleCheckboxes = document.querySelectorAll('.form-check-input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    if (checkbox.checked) {
      // Add only the IDs of the currently displayed items (paginatedItems)
      const currentPageIds = this.paginatedItems.map(item => item.id);
      this.selectedItemIds = Array.from(new Set([...this.selectedItemIds, ...currentPageIds]));
      toggleCheckboxes.forEach(cb => cb.checked = true);
    } else {
      // Remove only the IDs of the currently displayed items (paginatedItems)
      this.selectedItemIds = [];
      toggleCheckboxes.forEach(cb => cb.checked = false);
    }
  
    console.log(this.selectedItemIds);
  }

  downloadLogs(): void {
    this.baseService.downloadLogs().subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logs.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
}