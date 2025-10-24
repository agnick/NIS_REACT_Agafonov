import React, { useState } from "react";
import { Movie } from "../types/Movie";
import "../styles/MovieCard.css";

interface MovieCardProps {
    movie: Movie;
    onToggleFavorite: (id: number) => void;
    viewMode: "grid" | "list";
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onToggleFavorite, viewMode }) => {
    const [animate, setAnimate] = useState(false);

    const handleClick = () => {
        setAnimate(true);
        onToggleFavorite(movie.id);
        setTimeout(() => setAnimate(false), 300);
    };

    return (
        <article className={`movie-card ${viewMode}`}>
            <img src={movie.posterUrl} alt={movie.title} className="poster" />

            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="year">{movie.year}</p>
            </div>

            <button
                onClick={handleClick}
                className={`fav-btn ${movie.isFavorite ? "active" : ""} ${animate ? "pulse" : ""}`}
            >
                {movie.isFavorite ? "★" : "☆"}
            </button>
        </article>
    );
};

export default MovieCard;
