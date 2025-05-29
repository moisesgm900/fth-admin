import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })

export class ApiService {
    data: any;
    apiUrl = 'http://192.168.30.100:8088/test_conexion/controllers/';
    opcion = '/_api.php?opcion=';
    apiLogin ='http://192.168.30.100:8088/test_conexion/controllers/auth/_api.php';
    private _http = inject(HttpClient);

    getVoluntersdoc(modelo: any, action: any, data?: any) {
        //console.log((this.apiUrl+ modelo+ this.opcion + action +data));
        return this._http.post<any[]>(this.apiUrl + modelo + this.opcion + action, data)
    }

    login(email: string, password: string): Observable<any> {
        console.log(this.apiLogin, { email, password })
        return this._http.post(this.apiLogin, { email, password });
    }
    guardarToken(token: string) {
        localStorage.setItem('token', token);
    }

    obtenerToken(): string | null {
        return localStorage.getItem('token');
    }
    logout() {
        localStorage.removeItem('token');
    }


}