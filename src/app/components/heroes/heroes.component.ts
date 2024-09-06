import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { MarvelService } from 'src/app/core/services/marvel.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {
  character: any;
  comics: any[] = [];
  rating = 0;
  stars = Array(5).fill(0);
  characterId = '';
  searchTerm: string = '';
  searchTerm$ = new Subject<string>();
  offset: number = 0;
  limit: number = 20;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;

  constructor(private marvelService: MarvelService) {}

  ngOnInit(): void {
    const savedCharacter = sessionStorage.getItem('character');
    if (savedCharacter) {
      this.character = JSON.parse(savedCharacter);
      this.characterId = `rating-${this.character.id}`;

      const savedRating = localStorage.getItem(this.characterId);
      if (savedRating) {
        this.rating = +savedRating;
      }

      this.loadRecentStories();
      this.setupSearchSubscription();  // Certifique-se de que isso é chamado
    }
  }

  setupSearchSubscription(): void {
    this.searchTerm$
      .pipe(
        debounceTime(300),
        switchMap((term) => {
          console.log('Search term inside setupSearchSubscription:', term);  // Adicione este log
          this.offset = (this.currentPage - 1) * this.limit;
          if (term.trim() === '') {
            return this.marvelService.getRecentComics(this.character.id, this.offset, this.limit);
          }
          return this.marvelService.searchComics(term, this.character.id, this.offset, this.limit);
        })
      )
      .subscribe(
        (response) => {
          console.log('Data received in subscription:', response);  // Adicione este log
          if (response && response.data) {
            this.comics = response.data.results;
          } else {
            console.warn('Dados inesperados recebidos:', response);
            this.comics = [];
            this.totalResults = 0;
          }
          this.updateTotalPages();
        },
        (error) => {
          console.error('Erro ao buscar quadrinhos:', error);
        }
      );
  }

  searchComics(): void {
    console.log('searchComics called');  // Adicione este log para depuração
    this.searchTerm$.next(this.searchTerm);  // Emite o valor do termo de busca
  }

  rate(star: number): void {
    this.rating = star;
    localStorage.setItem(this.characterId, this.rating.toString());
  }

  loadRecentStories(): void {
    this.offset = (this.currentPage - 1) * this.limit;
    this.marvelService.getRecentComics(this.character.id, this.offset, this.limit).subscribe(
      (response) => {
        if (response && response.data) {
          this.comics = response.data.results; // Extrai o array de quadrinhos
          this.totalResults = response.data.total; // Atualize totalResults com o total de resultados retornados pela API
        } else {
          console.warn('Dados inesperados recebidos:', response);
          this.comics = []; // Define como array vazio em caso de dados inesperados
          this.totalResults = 0; // Atualize totalResults em caso de dados inesperados
        }
        this.updateTotalPages();
      },
      (error) => {
        console.error('Erro ao carregar histórias:', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRecentStories();
  }

  private updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalResults / this.limit);
  }

  navigateToHome(): void {
    window.location.href = '/';
  }
}
