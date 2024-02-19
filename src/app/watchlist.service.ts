import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = 'http://localhost:8000/watchlist/';

  constructor(private http: HttpClient) { }

  getWatchlist(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  addToWatchlist(selectedSerie: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.post<any>(this.apiUrl, selectedSerie, { headers });
  }

  updateWatchlist(oeuvreId: number,updated:any, token: string): Observable<any>{
    const url = `${this.apiUrl}${oeuvreId}/`
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`)
    return this.http.put<any>(url,updated,{headers})
  }

  removeFromWatchlist(oeuvreId: number, token: string): Observable<any> {
    const url = `${this.apiUrl}${oeuvreId}/`;
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.delete<any>(url, { headers });
  }
}
