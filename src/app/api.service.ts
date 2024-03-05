import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private apiUrl = 'http://localhost:8000'

  constructor(private http:HttpClient) { }

  updateUser(username : string, token:string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`)
    // Troisième argument de la méthode put attend une option

    const options = {headers:headers}

    return this.http.put<any>(`${this.apiUrl}/update_user/`,{username}, options)
  }

  changePassword(old_password:string, new_password:string, token:string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`)

    const options = {headers:headers}
    
    return this.http.post<any>(`${this.apiUrl}/change_password/`,{old_password, new_password},options)
  }
}
