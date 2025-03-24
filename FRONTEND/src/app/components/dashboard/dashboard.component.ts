import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

interface Item {
  id: number;
  itemNameId: number;
  storagePlaceId: number;
  [key: string]: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Properties
  items: Item[] = [];
  filteredItems: Item[] = [];
  storagePlaces: any[] = [];
  itemNames: any[] = [];
  selectedItemIds: number[] = [];
  selectedStoragePlace: number = 0;
  newStoragePlaceId: any;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100, 250];

  // Modals
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

  // Filters
  filters = {
    itemNameId: undefined,
    storagePlaceId: undefined,
    createdBy: undefined,
    fromDate: undefined,
    toDate: undefined
  };
  filterError: string | null = null;

  // Messages
  message: string | null = null;
  isError: boolean = false;

  // Constructor
  constructor(private baseService: BaseService) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    this.loadItemNames();
    this.loadStoragePlaces();
    this.loadItems();
  }

  // Pagination Methods
  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.items.filter(item => item.storagePlaceId == this.selectedStoragePlace).slice(startIndex, endIndex);
  }

  get totalPages(): number {
    const allItems = this.items.filter(item => item.storagePlaceId == this.selectedStoragePlace);
    return Math.ceil(allItems.length / this.itemsPerPage);
  }

  updatePagination(): void {
    this.currentPage = 1; // Reset to the first page when itemsPerPage changes
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

  // Data Loading Methods
  selectStoragePlace(placeId: number): void {
    this.selectedStoragePlace = placeId;
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

  // Utility Methods
  getItemName(itemNameId: number): string {
    const item = this.itemNames.find(i => i.id === itemNameId);
    return item ? item.item : 'Unknown';
  }

  searchItems(searchTerm: string): void {
    if (searchTerm) {
      this.filteredItems = this.items.filter(item =>
        this.getItemName(item.itemNameId).includes(searchTerm) || ['item.productCode'].includes(searchTerm)
      );
    }
  }

  // CRUD Methods
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
      this.newStoragePlaceId = null;
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
      const currentPageIds = this.paginatedItems.map(item => item.id);
      this.selectedItemIds = Array.from(new Set([...this.selectedItemIds, ...currentPageIds]));
      toggleCheckboxes.forEach(cb => cb.checked = true);
    } else {
      this.selectedItemIds = [];
      toggleCheckboxes.forEach(cb => cb.checked = false);
    }
    console.log(this.selectedItemIds);
  }

  // Admin Check
  isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin;
    }
    return false;
  }

  // Filter Methods
  validateFilters(): boolean {
    this.filterError = null; // Reset error message
  
    if (this.filters.fromDate && this.filters.toDate) {
      const fromDate = new Date(this.filters.fromDate);
      const toDate = new Date(this.filters.toDate);
  
      if (toDate < fromDate) {
        this.filterError = 'Letöltés sikertelen! A záró dátum nem lehet korábbi, mint a kezdő dátum!';
        this.showMessage(this.filterError, true, 5000); // Display the error in the alert box
        return false;
      }
    }
  
    return true;
  }

  resetFilters(): void {
    this.filters = {
      itemNameId: undefined,
      storagePlaceId: undefined,
      createdBy: undefined,
      fromDate: undefined,
      toDate: undefined
    };
    this.filterError = null; // Clear any existing error messages
  }

  // Message Handling
  showMessage(msg: string, isError: boolean = false, duration: number = 3000): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => {
      this.message = null; // Clear the message after the specified duration
      this.isError = false; // Reset the error flag
    }, duration);
  }

  // Download Logs
  downloadLogs(): void {
    if (!this.validateFilters()) {
      this.resetFilters(); // Clear the filters
      return; // Stop execution if validation fails
    }
  
    this.baseService.downloadLogs(this.filters).subscribe(
      response => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'logs.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
  
        this.showMessage('A napló sikeresen letöltve!', false, 3000); // Show success message
      },
      error => {
        console.error('Error downloading logs:', error);
        this.showMessage('Hiba történt a napló letöltése közben!', true, 3000); // Show error message
      }
    );
  }
}