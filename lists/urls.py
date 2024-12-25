from django.urls import path

from lists.views import (
    index,
    MovieListView, MovieCreateView, MovieUpdateView, MovieDeleteView, MovieDetailView,
    GameListView, GameCreateView, GameDetailView, GameUpdateView, GameDeleteView,
    EventListView, EventCreateView, EventDetailView, EventUpdateView, EventDeleteView,
    IdeaListView, IdeaCreateView, IdeaDetailView, IdeaUpdateView, IdeaDeleteView,
    DesireListView, DesireCreateView, DesireDetailView, DesireUpdateView, DesireDeleteView,
    update_status,
)

app_name = "lists"

urlpatterns = [
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
    path("events/", EventListView.as_view(), name="event-list"),
    path("events/create/", EventCreateView.as_view(), name="event-create"),
    path("events/<int:pk>/", EventDetailView.as_view(), name="event-detail"),
    path("events/<int:pk>/update/", EventUpdateView.as_view(), name="event-update"),
    path("events/<int:pk>/delete/", EventDeleteView.as_view(), name="event-delete"),
    # endregion

    # region ---------- Idea Views  ----------
    path("ideas/", IdeaListView.as_view(), name="idea-list"),
    path("ideas/create/", IdeaCreateView.as_view(), name="idea-create"),
    path("ideas/<int:pk>/", IdeaDetailView.as_view(), name="idea-detail"),
    path("ideas/<int:pk>/update/", IdeaUpdateView.as_view(), name="idea-update"),
    path("ideas/<int:pk>/delete/", IdeaDeleteView.as_view(), name="idea-delete"),
    # idea

    # region ---------- Desire Views  ----------
    path("desires/", DesireListView.as_view(), name="desire-list"),
    path("desires/create/", DesireCreateView.as_view(), name="desire-create"),
    path("desires/<int:pk>/", DesireDetailView.as_view(), name="desire-detail"),
    path("desires/<int:pk>/update/", DesireUpdateView.as_view(), name="desire-update"),
    path("desires/<int:pk>/delete/", DesireDeleteView.as_view(), name="desire-delete"),
    path('<str:model_name>/<int:id>/update-status/', update_status, name='update-status'),
    # idea
]
