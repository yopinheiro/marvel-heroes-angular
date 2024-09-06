import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { MarvelService } from './core/services/marvel.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading = false;
  private loadingSubscription: Subscription | undefined;
  isPageHeroes: boolean | undefined;

  constructor(private marvelService: MarvelService, private router: Router, private cdr: ChangeDetectorRef) {
    this.isPageHeroes = false;

  this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => {
    this.checkIfHeroesPage();
  });
  }

  ngOnInit(): void {
    this.checkIfHeroesPage();
    this.loadingSubscription = this.marvelService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
      this.cdr.detectChanges(); // Força a detecção de mudanças
    });

  }

  private checkIfHeroesPage(): void {
    if (window.location.href.includes('heroes')) {
      this.isPageHeroes = true;
      console.log(this.isPageHeroes);
      console.log('Pagina Heroes');
    } else {
      this.isPageHeroes = false;
      console.log(this.isPageHeroes);
    }
  }

  ngOnDestroy(): void {
    // Limpar a assinatura para evitar vazamentos de memória
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
