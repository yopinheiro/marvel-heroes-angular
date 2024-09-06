import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5';
import { Character, CharacterResult } from '../model/character.model';

interface MarvelApiResponse {
  data: {
    results: CharacterResult[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class MarvelService {
  private baseUrl = 'https://gateway.marvel.com:443/v1/public';
  private publicKey = '0f4818a6abad2e1db37812a1d051beaa';
  private privateKey = 'c547ae2864538df191364e71befea3aa97c12eec';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private generateHash(ts: number): string {
    return Md5.hashStr(ts + this.privateKey + this.publicKey) as string;
  }

  getCharacters(offset: number, limit: number): Observable<CharacterResult[]> {
    const timestamp = new Date().getTime();
    const hash = this.generateHash(timestamp);
    const url = `${this.baseUrl}/characters`;

    const params = new HttpParams()
      .set('apikey', this.publicKey)
      .set('ts', timestamp.toString())
      .set('hash', hash)
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    this.loadingSubject.next(true);

    return this.http.get<MarvelApiResponse>(url, { params }).pipe(
      tap(() => this.loadingSubject.next(false)),
      map((response) => response.data.results),
      catchError((error) => {
        console.error('Error fetching characters:', error);
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  searchCharacters(
    term: string,
    offset: number = 0,
    limit: number = 20
  ): Observable<CharacterResult[]> {
    const timestamp = new Date().getTime();
    const hash = this.generateHash(timestamp);
    const url = `${this.baseUrl}/characters`;

    const params = new HttpParams()
      .set('apikey', this.publicKey)
      .set('ts', timestamp.toString())
      .set('hash', hash)
      .set('nameStartsWith', term)
      .set('offset', offset.toString()) // Adiciona o offset para paginação
      .set('limit', limit.toString()); // Adiciona o limit para definir o número de resultados por página

    this.loadingSubject.next(true);

    return this.http.get<MarvelApiResponse>(url, { params }).pipe(
      tap(() => this.loadingSubject.next(false)),
      map((response) => response.data.results),
      catchError((error) => {
        console.error('Error fetching characters:', error);
        this.loadingSubject.next(false);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  getRecentComics(
    characterId: string,
    offset: number = 0,
    limit: number = 20
  ): Observable<Character> {
    const timestamp = new Date().getTime();
    const hash = this.generateHash(timestamp);
    const url = `${this.baseUrl}/characters/${characterId}/comics`;
  
    const params = new HttpParams()
      .set('apikey', this.publicKey)
      .set('ts', timestamp.toString())
      .set('hash', hash)
      .set('orderBy', 'modified')
      .set('limit', limit.toString())
      .set('offset', offset.toString());
  
    this.loadingSubject.next(true);
  
    return this.http.get<Character>(url, { params }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        console.error('Error fetching comics:', error);
        this.loadingSubject.next(false);
        // Retorna um objeto Character vazio ou com valores padrão, para manter a tipagem correta
        return of({
          code: 0,
          status: '',
          copyright: '',
          attributionText: '',
          attributionHTML: '',
          etag: '',
          data: {
            offset: 0,
            limit: 0,
            total: 0,
            count: 0,
            results: [],
          },
        });
      })
    );
  }
  
  searchComics(
    title: string,
    characterId: string,
    offset: number = 0,
    limit: number = 20
  ): Observable<MarvelApiResponse> {  // Ajuste o tipo de retorno para MarvelApiResponse
    const timestamp = new Date().getTime();
    const hash = this.generateHash(timestamp);
    const url = `${this.baseUrl}/characters/${characterId}/comics`;
  
    const params = new HttpParams()
      .set('apikey', this.publicKey)
      .set('ts', timestamp.toString())
      .set('hash', hash)
      .set('titleStartsWith', title) // Filtra por título de quadrinho
      .set('limit', limit.toString())
      .set('offset', offset.toString());
  
    this.loadingSubject.next(true);
  
    return this.http.get<MarvelApiResponse>(url, { params }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        console.error('Error fetching comics:', error);
        this.loadingSubject.next(false);
        return of({ data: { results: [], total: 0 } });  // Retorna um objeto padrão que corresponde ao tipo esperado
      })
    );
  }  
}
