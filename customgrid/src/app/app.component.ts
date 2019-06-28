import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, Inject, ViewChild, ElementRef } from '@angular/core';

import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType, GridsterItemComponentInterface } from 'angular-gridster2';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Injectable } from '@angular/core';

import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatTableModule, MatTable } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  editMode: Boolean;
  
  @ViewChild('table',{static:true}) videoTable: MatTable<any>;
  options: GridsterConfig;

  entity: any = {};

  constructor(private _http: HttpClient, private _snackBar: MatSnackBar, private _dialog: MatDialog) {
    this.loadFunc();
    this.loadDp();
  }

  ngOnInit() {

    this.options = {
      gridType: GridType.VerticalFixed,
      compactType: CompactType.None,
      margin: 20,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 800,
      isMobile: false,
      mobileModeEnabled: true,
      minCols: 4,
      maxCols: 4,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 150,
      fixedRowHeight: 65,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: true,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      //emptyCellClickCallback: this.emptyCellClick.bind(this),
      //emptyCellContextMenuCallback: this.emptyCellClick.bind(this),
      //emptyCellDropCallback: this.emptyCellClick.bind(this),
      //emptyCellDragCallback: this.emptyCellClick.bind(this),
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: false,
      },
      swap: true,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: true,
      displayGrid: DisplayGrid.None,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      itemChangeCallback: this.itemChange.bind(this)
    };

    this.loadFields();
  }

  loadFunc() {
    this.getFunc().subscribe(value => {
      this.dataSource.data = value;
    })
  }


  loadDp() {
    this.getDp().subscribe(value => {
      this.displayedColumns = value;
    })
  }

  loadFields() {
    this.getFields().subscribe(value => {
      this.entity = {};
      this.entity.customFields = value.map(function (elem) { return { meta: elem } });
      this.changedOptions();
    })
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeFunc(item){
    this._http.delete<any>('http://localhost:8080/funcionario/' + item.id).subscribe(data => {
      this.dataSource.data.splice(this.dataSource.data.indexOf(item), 1);
      this.videoTable.renderRows();
    });
  }

  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this._http.delete<any>('http://localhost:8080/meta/' + item.meta.id).subscribe(data => {
      this.entity.customFields.splice(this.entity.customFields.indexOf(item), 1);
      this.displayedColumns.splice(this.displayedColumns.indexOf(item.meta.label), 1);
      this.changedOptions();
    });
  }

  toggleEditMode() {

    this.editMode = !this.editMode;

    if (this.editMode) {
      this.options.draggable.enabled = true;
      this.options.resizable.enabled = true;
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
      });
    } else {
      this.options.draggable.enabled = false;
      this.options.resizable.enabled = false;
    }

    this.changedOptions();
  }

  itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
    console.info('itemChanged', item, itemComponent);
    this.saveField(item)
  }

  onToggleFab() {
    //this.addItem();
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(DialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.entity.customFields.push({ meta: { x: 0, y: 0, cols: 1, rows: 1, type: result.type, id: result.id, label: result.label, options: result.options, entity: 'FUNCIONARIO' } });
      this.changedOptions();
      this.saveField(this.entity.customFields[this.entity.customFields.length - 1].meta);
    });
  }

  getFields(): Observable<any[]> {
    return this._http.get<any[]>('http://localhost:8080/meta');
  }

  getFunc(): Observable<any[]> {
    return this._http.get<any[]>('http://localhost:8080/funcionario/flat');
  }

  getDp(): Observable<any[]> {
    return this._http.get<any[]>('http://localhost:8080/funcionario/fields');
  }

  saveField(field: any) {
    return this._http.post('http://localhost:8080/meta', field)
      .subscribe(data => {
        console.log('Created!', data);
      }, error => {
        console.log('error');
      });
  }

  onSave() {
    this._http.post('http://localhost:8080/funcionario', this.entity)
      .subscribe(data => {
        console.log('Created!', data);
        this.loadFields();
        this.loadFunc();
        this.loadDp();
        this.videoTable.renderRows();
      }, error => {
        console.log('error');
        this.loadFields();
      });
  }

}

@Component({
  selector: 'snackbar',
  templateUrl: 'snackbar.html',
})
export class SnackBarComponent { }


@Component({
  selector: 'dialog-selector',
  templateUrl: 'dialog.html',
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}