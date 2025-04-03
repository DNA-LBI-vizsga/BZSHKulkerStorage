import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import * as XLSX from 'xlsx';
import { ItemNameService } from '../../services/item-name/item-name.service';
import { StorageService } from '../../services/storage/storage.service';
import { ItemService } from '../../services/item/item.service';
import { LogService } from '../../services/log/log.service';
import { UserService } from '../../services/user/user.service';


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
  users: any[] = [];

  selectedItemIds: number[] = [];
  isChecked: boolean = false;

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
  timeoutId: any = null;

  deleteType: 'itemName' | 'storagePlace' = 'itemName';
  deleteTypeId: number | null = null;

  // Modals
  newItem: any = {
    itemNameId: null,
    storagePlaceId: null,
    quantity: 0
  };

  // Filters
  logFilters = {
    itemNameId: undefined,
    storagePlaceId: undefined,
    userId: undefined,
    createdBy: undefined,
    fromDate: undefined,
    toDate: undefined
  };

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100, 250];  

  constructor(
    private authService: AuthService,
    private itemService: ItemService, 
    private itemNameService: ItemNameService,
    private storageService: StorageService,
    private logService: LogService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.loadItemNames(() => {this.loadItems();}); // Load item names first, then load items
    this.loadStoragePlaces();
    if(this.isAdmin){
      this.loadUsers();
    }
  }

  // Loading Data
  loadItems(): void {
    this.itemService.getItems().subscribe((data: Item[]) => {
      this.items = data.map((item: Item) => ({
        ...item,
        productCode: `BZSH-${this.getItemNameById(item.itemNameId)}-${item.id}`
      }));
      console.log("Items: ", this.items);
      this.filteredItems = [...this.items];
      console.log("Filtered Items: ", this.filteredItems);
    });
  }

  loadStoragePlaces(): void {
    this.storageService.getStoragePlaces().subscribe(data => {
      this.storagePlaces = data;
      console.log("Storage Places: ", this.storagePlaces);
    });
  }

  loadItemNames(callback?: () => void): void {
    this.itemNameService.getItemNames().subscribe(data => {
      this.itemNames = data;
      console.log("Item Names: ", this.itemNames);

      if (callback) {
        callback();
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      console.log("Users: ", this.users);
      });
  };

  
  // Item CRUD Methods
  createItem(): void {
    if (!this.newItem.quantity || !this.newItem.itemNameId || !this.newItem.storagePlaceId) {
      this.showMessage('Minden mező kitöltése kötelező!', true, 3000);
      return;
    }
  
    this.itemService.createItem(this.newItem.itemNameId, this.newItem.storagePlaceId, this.newItem.quantity).subscribe({
      next: () => {
        this.filterText = '';
        this.loadItems();
        this.clearSelection();
        this.newItem = { itemNameId: null, quantity: 0 };
        this.showMessage('Sikeres hozzáadás!', false, 3000);
      },
      error: (err) => {
        console.error('Error creating item:', err);
        this.showMessage('Hiba történt a termék hozzáadása közben! Próbálja újra.', true, 5000);
      }
    });
  }

  updateItem(itemIdList: number[], newStoragePlaceId: number): void {
    this.itemService.updateItem(itemIdList, newStoragePlaceId).subscribe({
      next: () => {
        this.loadItems();
        this.clearSelection();
        this.newStoragePlaceId = null;
        this.filterText = '';
        this.showMessage('A termék(ek) sikeresen áthelyezve!', false, 3000);
      },
      error: (err) => {
        console.error('Error updating item(s):', err);
        this.showMessage('Hiba történt a termék(ek) áthelyezése közben! Próbálja újra.', true, 5000);
      }
    });
  }

  deleteItem(itemIdList: number[]): void {
    this.itemService.deleteItem(itemIdList).subscribe({
      next: () => {
        this.loadItems();
        this.clearSelection();
        this.filterText = '';
        this.showMessage('A termék(ek) sikeresen törölve!', false, 3000); // Success message
      },
      error: err => {
        console.error('Error deleting item(s):', err);
        this.showMessage('Hiba történt a termék(ek) törlése közben! Próbálja újra.', true, 5000); // Error message
      }
    });
  }
  
  // Create / Delete Storage Place
  createStoragePlace(): void {
    if (!this.newStoragePlace || this.newStoragePlace.trim() === '') {
      this.showMessage('A raktár helye nem lehet üres!', true, 3000);
      return;
    }
  
    const isDuplicate = this.storagePlaces.some(
      place => place.storage.toLowerCase() === this.newStoragePlace.trim().toLowerCase()
    );
    if (isDuplicate) {
      this.showMessage('Ez a raktár már létezik!', true, 3000);
      return;
    }
  
    this.storageService.createStoragePlace(this.newStoragePlace).subscribe({
      next: () => {
        this.loadStoragePlaces();
        this.newStoragePlace = '';
        this.showMessage('A raktár sikeresen hozzáadva!', false, 3000);
      },
      error: (err) => {
        console.error('Error creating storage place:', err);
        this.showMessage('Hiba a raktár hozzáadása közben! Próbálja újra.', true, 5000);
      }
    });
  }

  deleteStoragePlace(id: number): void {
    this.storageService.deleteStoragePlace(id).subscribe({
      next: () => {
        this.loadStoragePlaces();
        this.showMessage('A raktár törlése sikeres!', false, 3000);
      },
      error: err => {
        console.error('Error deleting item name:', err);
        this.showMessage('A raktár törlése sikertelen! Ellenőrizze, hogy nincs-e termék a raktárban!', true, 5000);
      }
    });
  }

   // Create / Delete Item Name
  createItemName(): void {
    if (!this.newItemName || this.newItemName.trim() === '') {
      this.showMessage('A termék neve nem lehet üres!', true, 3000);
      return;
    }
  
    const isDuplicate = this.itemNames.some(item => item.item.toLowerCase() === this.newItemName.trim().toLowerCase());
    if (isDuplicate) {
      this.showMessage('Ez a termék típus már létezik!', true, 3000);
      return;
    }
  
    this.itemNameService.createItemName(this.newItemName).subscribe({
      next: () => {
        this.loadItemNames();
        this.newItemName = '';
        this.showMessage('A termék sikeresen hozzáadva!', false, 3000);
      },
      error: (err) => {
        console.error('Error creating item name:', err);
        this.showMessage('Hiba a termék hozzáadása közben! Próbálja újra.', true, 5000);
      }
    });
  }

  deleteItemName(id: number): void {
    this.itemNameService.deleteItemName(id).subscribe({
      next: () => {
        this.loadItemNames();
        this.showMessage('A termék törlése sikeres!', false, 3000);
      },
      error: err => {
        console.error('Error deleting item name:', err);
        this.showMessage('A termék törlése sikertelen! Ellenőrizze, hogy nincs-e raktárban ilyen termék!', true, 5000);
      }
    });
  }

  openTypeDeleteModal(type: 'itemName' | 'storagePlace', id: number): void {
    this.deleteType = type;
    this.deleteTypeId = id;
  }

  confirmTypeDelete(): void {
    if (this.deleteType === 'itemName') {
      this.deleteItemName(this.deleteTypeId!);
    }
    if (this.deleteType === 'storagePlace') {
      this.deleteStoragePlace(this.deleteTypeId!);
    }
  }

  
  // Filtering
  applyFilters(): void {
    this.clearSelection();
    const lowerCaseFilter = this.filterText.toLowerCase();

    this.filteredItems = this.items.filter(item => {
      const matchesSearchBar =
        item.productCode.toLowerCase().includes(lowerCaseFilter) ||
        this.getItemNameById(item.itemNameId).toLowerCase().includes(lowerCaseFilter) ||
        this.getStoragePlaceById(item.storagePlaceId).toLowerCase().includes(lowerCaseFilter);

      const matchesItemName =
        this.selectedItemNames.length === 0 || this.selectedItemNames.includes(item.itemNameId);
      const matchesStoragePlace =
        this.selectedStoragePlaces.length === 0 || this.selectedStoragePlaces.includes(item.storagePlaceId);
      return matchesSearchBar && matchesItemName && matchesStoragePlace;
    });

    this.currentPage = 1;
  }

  deselectItemNames(): void {
    this.selectedItemNames = [];
    this.applyFilters();
    //console.log('Deselected all item names');
  }

  deselectStoragePlaces(): void {
    this.selectedStoragePlaces = [];
    this.applyFilters();
    //console.log('Deselected all storage places');
  }

  toggleSelectItemName(itemNameId: number): void {
    const index = this.selectedItemNames.indexOf(itemNameId);
    if (index === -1) {
      this.selectedItemNames.push(itemNameId);
    } else {
      this.selectedItemNames.splice(index, 1);
    }
    //console.log('Selected Item Names:', this.selectedItemNames);
  }

  toggleSelectStoragePlace(storagePlaceId: number): void {
    const index = this.selectedStoragePlaces.indexOf(storagePlaceId);
    if (index === -1) {
      this.selectedStoragePlaces.push(storagePlaceId);
    } else {
      this.selectedStoragePlaces.splice(index, 1);
    }
    //console.log('Selected Storage Places:', this.selectedStoragePlaces);
  }

  toggleSelectAllItemNames(): void {
    if (this.selectedItemNames.length === this.itemNames.length) {
      this.selectedItemNames = [];
    } else {
      this.selectedItemNames = this.itemNames.map(item => item.id);
    }
    //console.log('Selected Item Names:', this.selectedItemNames);
  }

  toggleSelectAllStoragePlaces(): void {
    if (this.selectedStoragePlaces.length === this.storagePlaces.length) {
      this.selectedStoragePlaces = [];
    } else {
      this.selectedStoragePlaces = this.storagePlaces.map(place => place.id);
    }
    //console.log('Selected Storage Places:', this.selectedStoragePlaces);
  }

  resetFilters(): void {
    this.filterText = '';
    this.selectedItemNames = [];
    this.selectedStoragePlaces = [];
    this.applyFilters();
  }


  // Sorting
  orderBy(column: string): void {
    // 
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
        valueA = this.getItemNameById(a.itemNameId).toLowerCase();
        valueB = this.getItemNameById(b.itemNameId).toLowerCase();
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
    this.resetSelectAllCheckbox();
    if (checkbox.checked) {
      this.selectedItemIds.push(itemId);
    } else {
      this.selectedItemIds = this.selectedItemIds.filter(id => id !== itemId);
    }
    console.log(this.selectedItemIds);
  }

  selectAllItems(): void {
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

  resetSelectAllCheckbox(): void {
    const selectAllCheckbox = document.querySelector('.form-check-input[type="checkbox"]') as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
      this.isChecked = false;
    }
  }

  clearSelection(): void {
    this.selectedItemIds = [];
    this.resetSelectAllCheckbox();
  }

  // Download Tags
  downloadTags(): void {
    const selectedItemsData = this.selectedItemIds.length > 0
      ? this.items.filter(item => this.selectedItemIds.includes(item.id))
      : this.filteredItems;

    const dataForExport = selectedItemsData.map(item => ({
      'Termék kód': `BZSH-${this.getItemNameById(item.itemNameId)}-${item.id}`,
      'Termék név': this.getItemNameById(item.itemNameId),
      'Raktár hely': this.getStoragePlaceById(item.storagePlaceId)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Termékek");
    XLSX.writeFile(workbook, `${this.fileName}.xlsx`);
    this.fileName = '';
  }

  // Download Logs
  downloadLogs(): void {
    if (!this.validateLogFilters()) {
      this.resetLogFilters();
      return;
    }

    this.logService.downloadLogs(this.logFilters).subscribe(
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

  validateLogFilters(): boolean {
    if (this.logFilters.fromDate && this.logFilters.toDate) {
      const fromDate = new Date(this.logFilters.fromDate);
      const toDate = new Date(this.logFilters.toDate);
      if (toDate < fromDate) {
        this.showMessage('Letöltés sikertelen! A záró dátum nem lehet korábbi, mint a kezdő dátum!', true, 5000);
        return false;
      }
    }
    return true;
  }

  resetLogFilters(): void {
    this.logFilters = {
      itemNameId: undefined,
      storagePlaceId: undefined,
      userId: undefined,
      createdBy: undefined,
      fromDate: undefined,
      toDate: undefined
    };
  }
 
  // Admin Check

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Getters for Item Names and Storage Places
  
  getItemNameById(itemNameId: number): string {
    const item = this.itemNames.find(i => i.id === itemNameId);
    return item ? item.item : 'Unknown';
  }

  getStoragePlaceById(storagePlaceId: number): string {
    const storagePlace = this.storagePlaces.find(place => place.id === storagePlaceId);
    return storagePlace ? storagePlace.storage : 'Unknown';
  }

  // Alert Message Handling

  showMessage(msg: string, isError: boolean, duration: number): void {
    this.alertMessage = msg;
    this.isError = isError;
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.alertMessage = null;
      this.isError = false;
      this.timeoutId = null;
    }, duration);
  }
}
