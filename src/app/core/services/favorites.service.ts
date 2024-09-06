import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private storageKey = 'favoriteCharacters';
    private maxFavorites = 5; // Defina o limite máximo de favoritos

    constructor() { }

    getFavorites(): number[] {
        const favorites = localStorage.getItem(this.storageKey);
        return favorites ? JSON.parse(favorites) : [];
    }

    toggleFavorite(characterId: number): void {
        const favorites = this.getFavorites();
        let errorMessage = ''; // Variável para armazenar a mensagem de erro
    
        // Se o ID já está nos favoritos, remova-o
        if (favorites.includes(characterId)) {
            const index = favorites.indexOf(characterId);
            if (index > -1) {
                favorites.splice(index, 1);
            }
        } else {
            // Se não está nos favoritos, verifique o limite
            if (favorites.length < this.maxFavorites) {
                favorites.push(characterId); // Adiciona o favorito
            } else {
                // Define a mensagem de erro em vez de lançar uma exceção
                errorMessage = `Você só pode ter até ${this.maxFavorites} favoritos.`;
            }
        }
    
        if (errorMessage) {
            this.displayModal(errorMessage); // Exibe a mensagem de erro no modal
        } else {
            localStorage.setItem(this.storageKey, JSON.stringify(favorites));
            console.log(`Favoritos atualizados: ${JSON.stringify(favorites)}`);
        }
    }
    
    displayModal(message: string): void {
        const modalElement = document.getElementById('error-modal');
        const modalMessageElement = document.getElementById('modal-message');
    
        if (modalElement && modalMessageElement) {
            modalMessageElement.textContent = message; // Atualiza a mensagem do modal
            modalElement.style.display = 'block'; // Mostra o modal
        }
    }
    

    isFavorite(characterId: number): boolean {
        const favorites = this.getFavorites();
        return favorites.includes(characterId);
    }
}
