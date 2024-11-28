from django.urls import path

from lists.views import (
    index,
    MovieListView, MovieCreateView, MovieUpdateView, MovieDeleteView, MovieDetailView
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
    # endregion ---------- Topic Views  ----------

]