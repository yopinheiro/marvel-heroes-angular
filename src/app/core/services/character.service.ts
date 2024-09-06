import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MarvelService } from './marvel.service';
import { CharacterResult } from '../model/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private offset = new BehaviorSubject<number>(0);
  private limit = 50;
  private characters = new BehaviorSubject<CharacterResult[]>([]);
  private loading = new BehaviorSubject<boolean>(false);
  private endOfList = new BehaviorSubject<boolean>(false);

  constructor(private marvelService: MarvelService) {}

  getCharacters(): Observable<CharacterResult[]> {
    return this.offset.pipe(
      tap(() => this.loading.next(true)),
      switchMap(offset => this.marvelService.getCharacters(offset, this.limit)),
      tap(results => {
        if (results.length < this.limit) {
          this.endOfList.next(true); // Marca o fim da lista se menos de 50 itens forem retornados
        }
        this.characters.next([...this.characters.value, ...results]);
        this.loading.next(false);
      }),
      catchError(error => {
        console.error('Error fetching characters:', error);
        this.loading.next(false);
        return of([]);  // Retorna um array vazio em caso de erro
      })
    );
  }

  searchCharacters(term: string): Observable<CharacterResult[]> {
    return this.marvelService.searchCharacters(term).pipe(
      tap(results => this.characters.next(results)),
      catchError(error => {
        console.error('Error searching characters:', error);
        return of([]);  // Retorna um array vazio em caso de erro
      })
    );
  }

  loadMore() {
    if (!this.loading.value && !this.endOfList.value) {
      this.offset.next(this.offset.value + this.limit);
    }
  }

  getCharactersList(): Observable<CharacterResult[]> {
    return this.characters.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  hasMore(): Observable<boolean> {
    return this.endOfList.asObservable().pipe(
      map(end => !end)
    );
  }
}
