import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../app.config';
import { MainService } from 'src/app/shared/services/main.service';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractBackendClient {

  constructor(
    protected http: HttpClient,
    private mainService: MainService
    ) { }

  abstract getEnpoint(): string;

  public getFilter(pageIndex, pageSize){
    /**TODO: generate the filter? */

    const url = '/search?page='+ pageIndex +'&size=' + pageSize;

    return this.get(url)
  }


  public getById(id){
    const url  =  "/" + id;

    return this.get(url)
  }

  public get(enpoint){
    const url  = CONFIG.apiEndpoint + this.getEnpoint() + enpoint;

    return this.http.get(url, this.getOption(url)).toPromise().then(body =>{
      if (body){
        return JSON.parse(body.toString());
      }else {
        throw new Error("not Body in Create")
      }
    });
  }

  public delete(id: number){
    const url  = CONFIG.apiEndpoint + this.getEnpoint() + "/" + id;
    return this.http.delete(url, this.getOption(url)).toPromise();
  }

  public deleteMultiple(ids: number[]){
    const url  = CONFIG.apiEndpoint + this.getEnpoint();
    return this.http.request("DELETE", url,  {
      headers: this.mainService.buildHeaders(url),
      responseType: 'text' as 'json',
      body: ids
    }).toPromise();
  }

  public create(requestBody){
    const url  = CONFIG.apiEndpoint + this.getEnpoint();

    return this.http.post(
        url,
        requestBody,
        this.getOption(url)).toPromise().then(body =>{
          if (body){
            return JSON.parse(body.toString());
          }else {
            throw new Error("not Body in Create")
          }
        })
  }

  public update(requestBody){
    const url  = CONFIG.apiEndpoint + this.getEnpoint();
    return this.http.put(
      url,
      requestBody,
      this.getOption(url)).toPromise().then(body =>{
        if (body){
          return JSON.parse(body.toString());
        }else {
          throw new Error("not Body in Create")
        }
      });
  }

  protected getOption(url){
    return {
      headers: this.mainService.buildHeaders(url),
      responseType: 'text' as 'json'
    };
  }

}
