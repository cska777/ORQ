import os
import json
from celery import shared_task
from .scrap_aucinema import scrape_allocine_movies

@shared_task
def scrape_allocine_task():
    allocine_base_url = "https://www.allocine.fr/film/aucinema/"
    num_pages_to_scrape = 14

    top_movies = scrape_allocine_movies(allocine_base_url, num_pages_to_scrape)

    if top_movies:
        for movie in top_movies:
            # Supprimer la clé 'duree' du dictionnaire movie_info
            if 'duree' in movie:
                del movie['duree']

        # Obtenir le chemin d'accès absolu au répertoire de sortie
        output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'app', 'data'))

        # Ouvrir le fichier de sortie en utilisant le chemin d'accès absolu
        output_file = os.path.join(output_dir, 'allocine_cinema.json')
        with open(output_file, 'w', encoding='utf-8') as json_file:
            json.dump(top_movies, json_file, ensure_ascii=False, indent=4)
        print("Les informations des films ont été stockées dans allocine_cinema.json.")
    else:
        print("Aucune donnée n'a été récupérée. Vérifiez le script pour des messages d'erreur.")
