import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import * as XLSX from 'xlsx';

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
  
  items: any[] = [];
  filteredItems: any[] = [];
  storagePlaces: any[] = [];
  itemNames: any[] = [];

  selectedItemIds: number[] = [];
  selectedStoragePlaceIds: number[] = [];
  selectedItemNames: number[] = [];
  selectedStoragePlaces: number[] = [];

  newStoragePlaceId: any;
  newStoragePlace: any;
  newItemName: any;

  currentSortColumn: string | null = "id";
  isAscending: boolean = true;

  fileName: string = '';
  filterText: string = '';

  // Messages
  alertMessage: string | null = null;
  isError: boolean = false;

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
  logFilters = {
    itemNameId: undefined,
    storagePlaceId: undefined,
    createdBy: undefined,
    fromDate: undefined,
    toDate: undefined
  };
  filterError: string | null = null;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100, 250];

  // Selection
  isChecked: boolean = false;

  
  constructor(private baseService: BaseService) {}
  
  ngOnInit(): void {
    this.loadItemNames();
    this.loadStoragePlaces();
    this.loadItems();
  }

  
  // CRUD Methods
  createItem(): void {
    if (this.newItem.quantity === 0 || this.newItem.itemNameId === null) {
      alert("A termék típus és a mennyiségi mező nem lehet üres! Kérjük, adjon meg egy érvényes értékeket.");
      return;
    }

    this.baseService.createItem(this.newItem.itemNameId, this.newItem.storagePlaceId, this.newItem.quantity).subscribe(() => {
      this.filterText = '';
      this.loadItems();
      this.newItem = { itemNameId: null, quantity: 0 };
    });
  }

  deleteItem(itemIdList: number[]): void {
    this.baseService.deleteItem(itemIdList).subscribe(() => {
      this.loadItemNames();
      this.loadItems();
      this.clearSelection();
      this.filterText = '';
    });
  }

  updateItem(itemIdList: number[], newStoragePlaceId: number): void {
    this.baseService.updateItem(itemIdList, newStoragePlaceId).subscribe(() => {
      this.loadItems();
      this.clearSelection();
      this.newStoragePlaceId = null;
      this.filterText = '';
    });
  }

  
  // Loading Data
  loadItems(): void {
    if (this.itemNames.length === 0) {
      this.loadItemNames();
    }

    this.baseService.getItems().subscribe((data: Item[]) => {
      this.items = data.map((item: Item) => ({
        ...item,
        productCode: `BZSH-${this.getItemName(item.itemNameId)}-${item.id}`
      }));

      const hasUnknownItemName = this.items.some(item => this.getItemName(item.itemNameId) === 'Unknown');
      if (hasUnknownItemName) {
        console.warn('Unknown item name detected. Refreshing the page...');
        window.location.reload();
      }

      console.log(this.items);
      this.filteredItems = [...this.items];
    });
  }

  loadStoragePlaces(): void {
    this.baseService.getStoragePlaces().subscribe(data => {
      this.storagePlaces = data;
      console.log("Storage Places: ", this.storagePlaces);
    });
  }

  loadItemNames(): void {
    this.baseService.getItemNames().subscribe(data => {
      this.itemNames = data;
      console.log("Item Names: ", this.itemNames);
    });
  }

  
  // Create / Delete Item Names & Storage Places
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
    this.baseService.deleteStoragePlace(id).subscribe({
      next: () => this.loadStoragePlaces(),
      error: err => {
        console.error('Error deleting item name:', err);
        this.showMessage('A raktár törlése sikertelen! Ellenőrizze, hogy nincs-e termék a raktárban!', true, 5000);
      }
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

  deleteItemName(id: number): void {
    this.baseService.deleteItemName(id).subscribe({
      next: () => this.loadItemNames(),
      error: err => {
        console.error('Error deleting item name:', err);
        this.showMessage('A termék törlése sikertelen! Ellenőrizze, hogy nincs-e raktárban ilyen termék!', true, 5000);
      }
    });
  }

  
  // Filtering
  applyFilter(): void { this.applyCombinedFilters(); }
  applyNameFilter(): void { this.applyCombinedFilters(); }
  applyStorageFilter(): void { this.applyCombinedFilters(); }
  applyTableFilters(): void { this.applyCombinedFilters(); }

  applyCombinedFilters(): void {
    const lowerCaseFilter = this.filterText.toLowerCase();

    this.filteredItems = this.items.filter(item => {
      const matchesSearchBar =
        item.productCode.toLowerCase().includes(lowerCaseFilter) ||
        this.getItemName(item.itemNameId).toLowerCase().includes(lowerCaseFilter) ||
        this.getStoragePlaceById(item.storagePlaceId).toLowerCase().includes(lowerCaseFilter);

      const matchesItemName =
        this.selectedItemNames.length === 0 || this.selectedItemNames.includes(item.itemNameId);
      const matchesStoragePlace =
        this.selectedStoragePlaces.length === 0 || this.selectedStoragePlaces.includes(item.storagePlaceId);

      return matchesSearchBar && matchesItemName && matchesStoragePlace;
    });

    this.currentPage = 1;
  }

  deselectAllFilters(): void {
    this.selectedItemNames = [];
    this.selectedStoragePlaces = [];
  }

  deselectItemNames(): void {
    this.selectedItemNames = [];
  }

  deselectStoragePlaces(): void {
    this.selectedStoragePlaces = [];
  }

  toggleSelectAllItems(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.selectedItemNames = checkbox.checked ? this.itemNames.map(item => item.id) : [];
  }

  toggleSelectAllStoragePlaces(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.selectedStoragePlaces = checkbox.checked ? this.storagePlaces.map(place => place.id) : [];
  }

  
  // Download Methods
  downloadTags(): void {
    const selectedItemsData = this.selectedItemIds.length > 0
      ? this.items.filter(item => this.selectedItemIds.includes(item.id))
      : this.filteredItems;

    const dataForExport = selectedItemsData.map(item => ({
      'Termék kód': `BZSH-${this.getItemName(item.itemNameId)}-${item.id}`,
      'Termék név': this.getItemName(item.itemNameId),
      'Raktár hely': this.getStoragePlaceById(item.storagePlaceId)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Termékek");
    XLSX.writeFile(workbook, `${this.fileName}.xlsx`);
    this.fileName = '';
  }

  downloadLogs(): void {
    if (!this.validateFilters()) {
      this.resetLogFilters();
      return;
    }

    this.baseService.downloadLogs(this.logFilters).subscribe(
      response => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'logs.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showMessage('A napló sikeresen letöltve!', false, 3000);
      },
      error => {
        console.error('Error downloading logs:', error);
        this.showMessage('Hiba történt a napló letöltése közben!', true, 3000);
      }
    );
  }

  // Sorting
  orderBy(column: string): void {
    if (this.currentSortColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortColumn = column;
      this.isAscending = true;
    }

    this.filteredItems.sort((a, b) => {
      let valueA: string | number = '';
      let valueB: string | number = '';

      if (column === "id") {
        valueA = a.id;
        valueB = b.id;
      } else if (column === "itemName") {
        valueA = this.getItemName(a.itemNameId).toLowerCase();
        valueB = this.getItemName(b.itemNameId).toLowerCase();
      } else if (column === "storagePlace") {
        valueA = this.getStoragePlaceById(a.storagePlaceId).toLowerCase();
        valueB = this.getStoragePlaceById(b.storagePlaceId).toLowerCase();
      }

      return this.isAscending ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    });
  }

  // Pagination
  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + Number(this.itemsPerPage);
    return this.filteredItems.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  updatePagination(): void { this.currentPage = 1; }

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

  // Selection Methods
  toggleItemSelection(event: Event, itemId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedItemIds.push(itemId);
    } else {
      this.selectedItemIds = this.selectedItemIds.filter(id => id !== itemId);
    }
    console.log(this.selectedItemIds);
  }

  toggleSelectAll(): void {
    this.isChecked = !this.isChecked;
    this.selectAll();
  }

  selectAll(): void {
    const toggleCheckboxes = document.querySelectorAll('.form-check-input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    if (this.isChecked) {
      const currentPageIds = this.paginatedItems.map(item => item.id);
      this.selectedItemIds = Array.from(new Set([...this.selectedItemIds, ...currentPageIds]));
      toggleCheckboxes.forEach(cb => cb.checked = true);
    } else {
      this.selectedItemIds = [];
      toggleCheckboxes.forEach(cb => cb.checked = false);
    }
    console.log(this.selectedItemIds);
  }

  clearSelection(): void {
    this.selectedItemIds = [];
    this.selectedStoragePlaceIds = [];
    this.isChecked = false;
    this.resetSelectAllCheckbox();
  }

  resetSelectAllCheckbox(): void {
    const selectAllCheckbox = document.querySelector('.form-check-input[type="checkbox"]') as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
    }
  }

  
  // Utility Methods
  
  getItemName(itemNameId: number): string {
    const item = this.itemNames.find(i => i.id === itemNameId);
    return item ? item.item : 'Unknown';
  }

  getStoragePlaceById(storagePlaceId: number): string {
    const storagePlace = this.storagePlaces.find(place => place.id === storagePlaceId);
    return storagePlace ? storagePlace.storage : 'Unknown';
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin;
    }
    return false;
  }

  validateFilters(): boolean {
    this.filterError = null;
    if (this.logFilters.fromDate && this.logFilters.toDate) {
      const fromDate = new Date(this.logFilters.fromDate);
      const toDate = new Date(this.logFilters.toDate);
      if (toDate < fromDate) {
        this.filterError = 'Letöltés sikertelen! A záró dátum nem lehet korábbi, mint a kezdő dátum!';
        this.showMessage(this.filterError, true, 5000);
        return false;
      }
    }
    return true;
  }

  resetFilters(): void {
    this.filterText = '';
    this.selectedItemNames = [];
    this.selectedStoragePlaces = [];
    this.applyCombinedFilters();
  }

  resetLogFilters(): void {
    this.logFilters = {
      itemNameId: undefined,
      storagePlaceId: undefined,
      createdBy: undefined,
      fromDate: undefined,
      toDate: undefined
    };
    this.filterError = null;
  }

  showMessage(msg: string, isError: boolean = false, duration: number = 3000): void {
    this.alertMessage = msg;
    this.isError = isError;
    setTimeout(() => {
      this.alertMessage = null;
      this.isError = false;
    }, duration);
  }
}
