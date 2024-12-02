from django.urls import path

from lists.views import (
    index,
    MovieListView, MovieCreateView, MovieUpdateView, MovieDeleteView, MovieDetailView,
    GameListView, GameCreateView, GameDetailView, GameUpdateView, GameDeleteView,
    EventListView, EventCreateView, EventDetailView, EventUpdateView, EventDeleteView,

)

app_name = "lists"

urlpatterns = [
    path('index/', index, name='index'),
    path('', index, name='index'),

    # region ---------- Movie Views  ----------
    path("movies/", MovieListView.as_view(), name="movie-list"),
    path("movies/create/", MovieCreateView.as_view(), name="movie-create"),
    path("movies/<int:pk>/", MovieDetailView.as_view(), name="movie-detail"),
    path("movies/<int:pk>/update/", MovieUpdateView.as_view(), name="movie-update"),
    path("movies/<int:pk>/delete/", MovieDeleteView.as_view(), name="movie-delete"),
    # endregion

    # region ---------- Game Views  ----------
    path("games/", GameListView.as_view(), name="game-list"),
    path("games/create/", GameCreateView.as_view(), name="game-create"),
    path("games/<int:pk>/", GameDetailView.as_view(), name="game-detail"),
    path("games/<int:pk>/update/", GameUpdateView.as_view(), name="game-update"),
    path("games/<int:pk>/delete/", GameDeleteView.as_view(), name="game-delete"),
    # endregion

    # region ---------- Game Views  ----------
    path("event/", EventListView.as_view(), name="event-list"),
    path("event/create/", EventCreateView.as_view(), name="event-create"),
    path("event/<int:pk>/", EventDetailView.as_view(), name="event-detail"),
    path("event/<int:pk>/update/", EventUpdateView.as_view(), name="event-update"),
    path("event/<int:pk>/delete/", EventDeleteView.as_view(), name="event-delete"),
    # endregion
]
