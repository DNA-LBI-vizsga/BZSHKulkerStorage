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
  // selectedStoragePlace: number = 0;
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

  filterText: string = ''; // Holds the filter input value
  newStoragePlace: any;
  newItemName: any;

  selectedItemNames: number[] = [];
  selectedStoragePlaces: number[] = [];

  // Constructor
  constructor(private baseService: BaseService) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    this.loadItemNames();
    this.loadStoragePlaces();
    this.loadItems();
  }

  fileName: string = '';

  downloadTags(): void {
    let selectedItemsData = null;
    if (this.selectedItemIds.length > 0) {
      selectedItemsData = this.items.filter(item => this.selectedItemIds.includes(item.id));
    }
    else {
      selectedItemsData = this.filteredItems;
    }
    const dataForExport = selectedItemsData.map(item => ({
      'Termék kód': `BZSH-${this.getItemName(item.itemNameId)}-${item.id}`,
      'Termék név': this.getItemName(item.itemNameId),
      'Raktár hely': this.getStoragePlaceById(item.storagePlaceId)}));

      const worksheet = XLSX.utils.json_to_sheet(dataForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Termékek");
      XLSX.writeFile(workbook, `${this.fileName}.xlsx`);
    }


  currentSortColumn: string | null = null;
  isAscending: boolean = true;

  orderBy(column: string): void {
    if (this.currentSortColumn === column) {
      this.isAscending = !this.isAscending;
    }
    else {
      this.currentSortColumn = column;
      this.isAscending = true;
    }

    this.filteredItems.sort((a,b) => {
      let valueA: string | number = "";
      let valueB: string | number = "";

      if (column == "id") {
        valueA = a.id;
        valueB = b.id;
      }
      else if (column == "itemName") {
        valueA = this.getItemName(a.itemNameId).toLowerCase();
        valueB = this.getItemName(b.itemNameId).toLowerCase();
      }
      else if (column == "storagePlace") {
        valueA = this.getStoragePlaceById(a.storagePlaceId).toLowerCase();
        valueB = this.getStoragePlaceById(b.storagePlaceId).toLowerCase();
      }

      if (this.isAscending) {
        return valueA > valueB ? 1 : -1;
      }
      else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  deselectAllFilters(): void {
    this.selectedItemNames = [];
    this.selectedStoragePlaces = [];
  }

  // Deselect all item names
  deselectItemNames(): void {
    this.selectedItemNames = [];
  }

// Deselect all storage places
  deselectStoragePlaces(): void {
    this.selectedStoragePlaces = [];
  }
  
  // Toggle "Select All" for item names
  toggleSelectAllItems(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedItemNames = this.itemNames.map(item => item.id); // Select all item IDs
    } else {
      this.selectedItemNames = []; // Deselect all
    }
  }
  
  // Toggle "Select All" for storage places
  toggleSelectAllStoragePlaces(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedStoragePlaces = this.storagePlaces.map(place => place.id); // Select all storage place IDs
    } else {
      this.selectedStoragePlaces = []; // Deselect all
    }
  }

  applyFilter(): void {
    this.applyCombinedFilters();
  }

  applyTableFilters(): void {
    this.applyCombinedFilters();
  }

  applyCombinedFilters(): void {
    const lowerCaseFilter = this.filterText.toLowerCase();
  
    this.filteredItems = this.items.filter(item => {
      // Search bar filter
      const matchesSearchBar =
        item.productCode.toLowerCase().includes(lowerCaseFilter) ||
        this.getItemName(item.itemNameId).toLowerCase().includes(lowerCaseFilter) ||
        this.getStoragePlaceById(item.storagePlaceId).toLowerCase().includes(lowerCaseFilter);
  
      // Modal filters
      const matchesItemName =
        this.selectedItemNames.length === 0 || this.selectedItemNames.includes(item.itemNameId);
      const matchesStoragePlace =
        this.selectedStoragePlaces.length === 0 || this.selectedStoragePlaces.includes(item.storagePlaceId);
  
      // Combine all filters
      return matchesSearchBar && matchesItemName && matchesStoragePlace;
    });
  
    this.currentPage = 1; // Reset to the first page after filtering
  }

  // applyFilter(): void {
  //   const lowerCaseFilter = this.filterText.toLowerCase();
  //   this.filteredItems = this.items.filter(item => {
  //     const itemName = this.getItemName(item.itemNameId).toLowerCase();
  //     const storagePlace = this.getStoragePlaceById(item.storagePlaceId).toLowerCase();
  //     return (
  //       item.productCode.toLowerCase().includes(lowerCaseFilter) ||
  //       itemName.includes(lowerCaseFilter) ||
  //       storagePlace.includes(lowerCaseFilter)
  //     );
  //   });
  //   this.currentPage = 1; // Reset to the first page after filtering
  // }

  // Pagination Methods
  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + Number(this.itemsPerPage);
    // console.log(startIndex, endIndex, this.itemsPerPage);
    return this.filteredItems.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  updatePagination(): void {
    this.currentPage = 1;
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

  getStoragePlaceById(storagePlaceId: number): string {
    const storagePlace = this.storagePlaces.find(place => place.id == storagePlaceId);
    return storagePlace ? storagePlace.storage : 'Unknown';
  }

  loadStoragePlaces() : void{
    this.baseService.getStoragePlaces().subscribe(data => {
      this.storagePlaces = data;
      console.log("Storage Places: ", this.storagePlaces);
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

  loadItemNames(): void {
    this.baseService.getItemNames().subscribe(data => {
      this.itemNames = data;
      console.log("Item Names: ", this.itemNames);
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
      next: () => {
        this.loadItemNames();
      },
      error: (err) => {
        console.error('Error deleting item name:', err);
        alert('A termék törlése sikertelen! Ellenőrizze, hogy nincs-e raktárban ilyen termék!');
      }
    });
}

loadItems(): void {
  if (this.itemNames.length === 0) {
    this.loadItemNames(); // Load item names if not already loaded
  }

  this.baseService.getItems().subscribe((data: Item[]) => {
    this.items = data.map((item: Item) => ({
      ...item,
      productCode: `BZSH-${this.getItemName(item.itemNameId)}-${item.id}`
    })).sort((a,b)=>a.id-b.id);
    console.log(this.items);
    this.filteredItems = [...this.items];
  });
}

  // Utility Methods
  getItemName(itemNameId: number): string {
    const item = this.itemNames.find(i => i.id === itemNameId);
    return item ? item.item : 'Unknown';
  }

  // CRUD Methods
  createItem(): void {
    if (this.newItem.quantity === 0 || this.newItem.itemNameId === null) {
      alert("A termék típus és a mennyiségi mező nem lehet üres! Kérjük, adjon meg egy érvényes értékeket.");
      return;
    }

    this.baseService.createItem(
      this.newItem.itemNameId,
      this.newItem.storagePlaceId,
      this.newItem.quantity
    ).subscribe(() => {
      this.filterText = '';
      this.loadItems();
      this.newItem = { itemNameId: null, quantity: 0 };
    });
  }

  deleteItem(itemIdList: number[]): void {
    console.log(itemIdList);
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

  // Selection Management
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

  toggleItemSelection(event: Event, itemId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedItemIds.push(itemId);
    } else {
      this.selectedItemIds = this.selectedItemIds.filter(id => id !== itemId);
    }
    console.log(this.selectedItemIds);
  }

  isChecked : boolean = false;

  toggleSelectAll()
  {
    this.isChecked = !this.isChecked;
    this.selectAll();
  }

  selectAll(): void {
    const toggleCheckboxes = document.querySelectorAll('.form-check-input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    if (this.isChecked == true) {
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