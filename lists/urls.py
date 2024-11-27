from django.urls import path

from lists.views import index, MovieListView

app_name = "lists"


urlpatterns = [
    path('index/', index, name='index'),
    path('', index, name='index'),

    # region ---------- Topic Views  ----------
    path("movies/", MovieListView.as_view(), name="movie-list"),
    # path("topics/create/", TopicCreateView.as_view(), name="topic-create"),
    # path("topics/<int:pk>/update/", TopicUpdateView.as_view(), name="topic-update"),
    # path("topics/<int:pk>/delete/", TopicDeleteView.as_view(), name="topic-delete"),
    # endregion ---------- Topic Views  ----------

]