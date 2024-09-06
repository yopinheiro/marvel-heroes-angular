import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { CharacterResult } from 'src/app/core/model/character.model';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { MarvelService } from 'src/app/core/services/marvel.service';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'; // Ícone sólido
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'; // Ícone regular
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  totalCharacters: number = 0;
  isSwitchOn = false;
  allCharacters: CharacterResult[] = [];
  filteredCharacters: CharacterResult[] = [];
  showFavorites: boolean = false;
  searchTerm: string = ''; // Armazena o termo de busca
  searchTerm$ = new Subject<string>();
  currentPage: number = 1;
  charactersPerPage: number = 20; // 20 personagens por página
  totalPages: number = 0; // Será calculado com base em totalCharacters
  faHeartSolid = faHeartSolid;
  faHeartRegular = faHeartRegular;

  constructor(
    private favoritesService: FavoritesService,
    private marvelService: MarvelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCharacters(); // Carrega os personagens na inicialização
    this.setUpSearchSubscriptionPeople();
  }

  loadCharacters(page: number = 1): void {
    this.currentPage = page; // Atualiza a página atual
    const offset = (this.currentPage - 1) * this.charactersPerPage;

    this.marvelService
      .getCharacters(offset, this.charactersPerPage)
      .subscribe((data) => {
        this.filteredCharacters = data;
        this.totalCharacters = 1564; // Ou obtenha este valor de uma chamada de API separada se disponível
        this.totalPages = Math.ceil(this.totalCharacters / this.charactersPerPage);
      });
  }

  searchCharacters(): void {
    this.currentPage = 1; // Resetar para a primeira página ao iniciar uma nova busca
    this.searchTerm$.next(this.searchTerm); // Emitir o termo de busca
  }

  toggleSort(): void {
    this.isSwitchOn = !this.isSwitchOn;
    this.sortCharacters();
  }

  setUpSearchSubscriptionPeople(): void {
    this.searchTerm$
      .pipe(
        debounceTime(300), // Aguarda 300ms de inatividade
        switchMap((term) => {
          if (term.trim() === '') {
            return this.marvelService.getCharacters(
              (this.currentPage - 1) * this.charactersPerPage,
              this.charactersPerPage
            );
          }
          return this.marvelService.searchCharacters(
            term,
            (this.currentPage - 1) * this.charactersPerPage,
            this.charactersPerPage
          );
        })
      )
      .subscribe((data) => {
        this.filteredCharacters = data;
        this.totalCharacters = this.filteredCharacters.length; // Atualiza a contagem total
      });
  }

  sortCharacters(): void {
    this.filteredCharacters.sort((a, b) =>
      this.isSwitchOn
        ? b.name.localeCompare(a.name) // Z/A
        : a.name.localeCompare(b.name) // A/Z
    );
    this.totalCharacters = this.filteredCharacters.length; // Atualiza a contagem total após a ordenação
  }

  filterFavorites(): void {
    this.showFavorites = !this.showFavorites;

    if (this.showFavorites) {
      const favorites = this.favoritesService.getFavorites();
      this.filteredCharacters = this.filteredCharacters.filter((character) =>
        favorites.includes(character.id)
      );
    } else {
      this.loadCharacters(this.currentPage); // Recarregue os personagens da página atual
    }

    this.sortCharacters(); // Reaplica a ordenação após a filtragem
  }

  onPageChange(page: number): void {
    this.loadCharacters(page); // Carrega os personagens da nova página
  }

  toggleFavorite(characterId: number): void {
    this.favoritesService.toggleFavorite(characterId);
  }

  isFavorite(characterId: number): boolean {
    return this.favoritesService.isFavorite(characterId);
  }

  openDetailHero(character: CharacterResult): void {
    sessionStorage.setItem('character', JSON.stringify(character));
    this.router.navigate(['/detail-character']);
  }

  closeModal(): void {
    const modalElement = document.getElementById('error-modal');
    if (modalElement) {
      modalElement.style.display = 'none'; // Esconde o modal
    }
  }
}
