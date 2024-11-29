from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import generic

from lists.forms import MovieSearchForm
from lists.models import Movie, Game


def index(request):
    return render(request, "lists/index.html")


# region ---------- Movie Views  ----------
class MovieListView(generic.ListView):
    model = Movie
    context_object_name = "movie_list"
    template_name = "lists/movie/movie_list.html"
    paginate_by = 10

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super(MovieListView, self).get_context_data(**kwargs)
        name = self.request.GET.get("name", "")
        context["search_form"] = MovieSearchForm(initial={"name": name})
        return context

    def get_queryset(self):
        queryset = Movie.objects.all()
        form = MovieSearchForm(self.request.GET)
        if form.is_valid():
            return queryset.filter(name__icontains=form.cleaned_data["name"])
        return queryset


class MovieCreateView(generic.CreateView):
    model = Movie
    fields = "__all__"
    success_url = reverse_lazy("lists:movie-list")
    template_name = "lists/movie/movie_form.html"


class MovieDetailView(generic.DetailView):
    model = Movie
    template_name = "lists/movie/movie_detail.html"


class MovieUpdateView(generic.UpdateView):
    model = Movie
    fields = "__all__"
    success_url = reverse_lazy("lists:movie-list")
    template_name = "lists/movie/movie_form.html"


class MovieDeleteView(generic.DeleteView):
    model = Movie
    success_url = reverse_lazy("lists:movie-list")
    template_name = "lists/movie/movie_confirm_delete.html"


# endregion ---------- Movie Views  ----------

# region ---------- Game Views  ----------
class GameListView(generic.ListView):
    model = Game
    context_object_name = "game_list"
    template_name = "lists/game/game_list.html"
    paginate_by = 10

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super(GameListView, self).get_context_data(**kwargs)
        name = self.request.GET.get("name", "")
        context["search_form"] = MovieSearchForm(initial={"name": name})
        return context

    def get_queryset(self):
        queryset = Movie.objects.all()
        form = MovieSearchForm(self.request.GET)
        if form.is_valid():
            return queryset.filter(name__icontains=form.cleaned_data["name"])
        return queryset


class GameCreateView(generic.CreateView):
    model = Game
    fields = "__all__"
    success_url = reverse_lazy("lists:game-list")
    template_name = "lists/game/game_form.html"


class GameDetailView(generic.DetailView):
    model = Game
    template_name = "lists/game/game_detail.html"


class GameUpdateView(generic.UpdateView):
    model = Game
    fields = "__all__"
    success_url = reverse_lazy("lists:game-list")
    template_name = "lists/game/game_form.html"


class GameDeleteView(generic.DeleteView):
    model = Game
    success_url = reverse_lazy("lists:game-list")
    template_name = "lists/game/game_confirm_delete.html"
# endregion ---------- Game Views  ----------
