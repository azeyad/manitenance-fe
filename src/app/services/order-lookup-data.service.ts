import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { OrderDataLookup, OrderStatusLookup } from '../models/order-data-lookup.model';

@Injectable({
  providedIn: 'root'
})
export class OrderLookupDataService {

  private areasCache: Map<String, OrderDataLookup[]> = new Map();
  private deptsCache: Map<String, OrderDataLookup[]> = new Map();
  private machinesCache: Map<String, OrderDataLookup[]> = new Map();

  constructor(private httpClient: HttpClient) { }

  public loadLines(): Observable<OrderDataLookup[]> {
    return this.httpClient.get<OrderDataLookup[]>("/api/v1/user/lookup/lines")
  }

  public loadLineAreas(lineUuid: String): Observable<OrderDataLookup[]> {
    if (this.areasCache.has(lineUuid)) {
      return of(this.areasCache.get(lineUuid)) as Observable<OrderDataLookup[]>;
    }
    return this.httpClient.get<OrderDataLookup[]>(`/api/v1/user/lookup/lineAreas?lineUuid=${lineUuid}`).pipe(
      tap(areas => this.areasCache.set(lineUuid, areas))
    );
  }

  public loadAreadepts(areaUuid: String): Observable<OrderDataLookup[]> {
    if (this.deptsCache.has(areaUuid)) {
      return of(this.deptsCache.get(areaUuid)) as Observable<OrderDataLookup[]>;
    }
    return this.httpClient.get<OrderDataLookup[]>(`/api/v1/user/lookup/areaDepts?areaUuid=${areaUuid}`).pipe(
      tap(depts => this.deptsCache.set(areaUuid, depts))
    );
  }

  public loadDeptMachines(deptUuid: String): Observable<OrderDataLookup[]> {
    if (this.machinesCache.has(deptUuid)) {
      return of(this.machinesCache.get(deptUuid)) as Observable<OrderDataLookup[]>;
    }
    return this.httpClient.get<OrderDataLookup[]>(`/api/v1/user/lookup/deptMachines?deptUuid=${deptUuid}`).pipe(
      tap(machines => this.machinesCache.set(deptUuid, machines))
    );
  }

  public loadUsers(): Observable<OrderDataLookup[]> {
    return this.httpClient.get<OrderDataLookup[]>("/api/v1/user/lookup/users")
  }

  public loadOrderStatuses(): Observable<OrderStatusLookup[]> {
    return this.httpClient.get<OrderStatusLookup[]>("/api/v1/user/lookup/orderStatuses")
  }
}
