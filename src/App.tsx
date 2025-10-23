import React, { useState } from "react";
import { Movie } from "./types/Movie";
import MovieCard from "./components/MovieCard";
import FilterBar from "./components/FilterBar";
import ViewToggle from "./components/ViewToggle";
import greenBookPoster from "./assets/images/green_book_img.webp"
import fightClubPoster from "./assets/images/fight_club_img.webp"
import brotherPoster from "./assets/images/brat_img.webp"
import "./styles/App.css";

const initialMovies: Movie[] = [
    { id: 1, title: "Зеленая книга", year: 2018, posterUrl: greenBookPoster, isFavorite: false },
    { id: 2, title: "Бойцовский клуб", year: 1999, posterUrl: fightClubPoster, isFavorite: true },
    { id: 3, title: "Брат", year: 1997, posterUrl: brotherPoster, isFavorite: false }
];

const App: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleToggleFavorite = (id: number) => {
        setMovies(prev =>
            prev.map(movie =>
                movie.id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie
            )
        );
    };

    const filteredMovies = movies.filter(movie => {
        const matchesFavorites = showOnlyFavorites ? movie.isFavorite : true;
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFavorites && matchesSearch;
    });

    return (
        <div className="app">
            <h1>Каталог фильмов</h1>

            <div className="controls">
                <FilterBar
                    showOnlyFavorites={showOnlyFavorites}
                    onToggleFavorites={setShowOnlyFavorites}
                    onSearch={setSearchQuery}
                />
                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            </div>

            <div className={`movie-list ${viewMode}`}>
                {filteredMovies.length > 0 ? (
                    filteredMovies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onToggleFavorite={handleToggleFavorite}
                            viewMode={viewMode}
                        />
                    ))
                ) : (
                    <p className="empty">Фильмов нет</p>
                )}
            </div>
        </div>
    );
};

export default App;
