import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = 'http://localhost:8080/api/v1/contract';

  constructor(private http: HttpClient) {}

  // POST request for submitting contract data
  postContractData(contractData: any): Observable<any> {
    const addContractUrl = `${this.apiUrl}/addContract`;
    return this.http.post(addContractUrl, contractData);
  }

  // GET request to fetch all contracts
  getContracts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);  // Send GET request to fetch contracts
  }

  // POST request for searching contracts based on provided search criteria
  searchContracts(searchData: any): Observable<any[]> {
    const searchUrl = `${this.apiUrl}/search`; // Assuming search endpoint
    return this.http.post<any[]>(searchUrl, searchData);  // Send POST request with search criteria
  }

  // DELETE request to delete a contract by contractId
  deleteContract(contractId: number): Observable<any> {
    const deleteUrl = `${this.apiUrl}/${contractId}`;  // Endpoint with contractId
    return this.http.delete(deleteUrl);  // Send DELETE request to delete the contract
  }
}
