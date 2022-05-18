import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { OrderDataLookup } from '../models/order-data-lookup.model';

@Injectable({
  providedIn: 'root'
})
export class OrderLookupDataService {

  constructor(private httpClient: HttpClient) { }

  public loadLines(): Observable<OrderDataLookup[]> {
    return this.httpClient.get<OrderDataLookup[]>("/api/v1/user/lookup/lines")
  }

  public loadLineAreas(lineUuid: String): Observable<OrderDataLookup[]> {
    return this.httpClient.get<OrderDataLookup[]>(`/api/v1/user/lookup/lineAreas?lineUuid=${lineUuid}`);
  }

  public loadAreadepts(areaUuid: String): Observable<OrderDataLookup[]> {
    return this.httpClient.get<OrderDataLookup[]>(`/api/v1/user/lookup/areaDepts?areaUuid=${areaUuid}`);
  }

  public loadDeptMachines(deptUuid: String): Observable<OrderDataLookup[]> {
    return this.httpClient.get<OrderDataLookup[]>(`/api/v1/user/lookup/deptMachines?deptUuid=${deptUuid}`);
  }

  public loadUsers(): Observable<OrderDataLookup[]> {
    return this.httpClient.get<OrderDataLookup[]>("/api/v1/user/lookup/users")
  }

  public loadOrderStatuses(): Observable<String[]> {
    return this.httpClient.get<String[]>("/api/v1/user/lookup/orderStatuses")
  }
}
