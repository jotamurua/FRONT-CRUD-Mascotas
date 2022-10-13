import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Mascota } from 'src/app/interfaces/mascota';
import { MascotaService } from 'src/app/services/mascota.service';




const listMascotas: Mascota[] = [
{nombre: 'Ciro', edad: 3, raza: 'Golden', color:'Dorado', peso:13}
];

@Component({
  selector: 'app-listado-mascota',
  templateUrl: './listado-mascota.component.html',
  styleUrls: ['./listado-mascota.component.css']
})
export class ListadoMascotaComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['nombre', 'edad', 'raza', 'color', 'peso', 'acciones'];
  dataSource = new MatTableDataSource<Mascota>();
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private __snackBar: MatSnackBar,
     private _mascotaService:MascotaService) { }

  ngOnInit(): void {
    this.obtenerMascotas();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  // obtenerMascotas(){
  //   this.loading = true;
  //   this._mascotaService.getMascotas().subscribe(data => {
  //     this.loading = false;
  //     this.dataSource.data = data;
  //   }, error => {this.loading = false;
  //     alert('Ups! Hubo algún error!')
  //   })
  // };

  obtenerMascotas(){
    this.loading = true;
    this._mascotaService.getMascotas().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (e)=> alert('Ups! Hubo algún error!'),
      complete: ()=>this.loading = false
    })
  }
  eliminarMascota(id: number){
    this.loading=true;
    this._mascotaService.deleteMascota(id).subscribe(() => {
      this.mensajeExito();
      this.loading = false;
      this.obtenerMascotas();
    });


  }
  mensajeExito(){
    this.__snackBar.open('La mascota fue eliminada','',{
      duration: 3000,
      horizontalPosition: 'right'
    })
  }
}
