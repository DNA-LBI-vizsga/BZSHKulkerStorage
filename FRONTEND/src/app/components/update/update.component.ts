import { Component } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {
 items: any[] = [];
 selectedItem: string ='';
 selectedStoragePlace: string = '';
  itemNames: any;
  storagePlaces: any;
  quantity: any;

 constructor(private baseService: BaseService, private router: Router) { }

 ngOnInit(): void {
  this.loadItems();
  this.loadItemNames();
  this.loadStoragePlaces();
}

loadItemNames(): void {
  this.baseService.getItemNames().subscribe(data => {
    this.itemNames = data;
    console.log(this.itemNames)
  });
}

loadStoragePlaces(): void {
  this.baseService.getStoragePlaces().subscribe(data => {
    this.storagePlaces = data;
  });
}

 moveItem(storagePlaceId:number,description:string,quantity:number): void {
    this.baseService.updateItem(storagePlaceId,description,quantity).subscribe(
      response => {
        console.log('Item moved:', response);
      },
      error => {
        console.error('Error moving item:', error);
 }
)
}
loadItems(): void {
  this.baseService.getItems().subscribe(data => {
    this.items = data;
    console.log(this.items);
    console.log(this.items.length)
  });
}

getFilteredItems(){
  return this.items.filter(item => item.item === this.selectedItem && item.storage === this.selectedStoragePlace).length;
}
}
