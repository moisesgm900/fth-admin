import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn : 'root'})

export class ApiService{
    data : any;
    apiUrl = 'http://localhost/test_conexion/controllers/';
    opcion= '/_api.php?opcion=';
    private _http = inject(HttpClient); 

    getVoluntersdoc(modelo: any, action:any, data?: any){
        //console.log((this.apiUrl+ modelo+ this.opcion + action +data));
        return this._http.post<any[]>(this.apiUrl+ modelo+ this.opcion + action ,data)
       
        
    }



  
}