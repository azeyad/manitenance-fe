import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataImportService {
    constructor(private httpClient: HttpClient) { }

    importFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.httpClient.post('/api/v1/admin/data/import', formData);
    }

}