from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import generic

from lists.forms import NameSearchForm
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
        context["search_form"] = NameSearchForm(initial={"name": name})
        return context

    def get_queryset(self):
        queryset = Movie.objects.all()
        form = NameSearchForm(self.request.GET)
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
from django.db.models import Case, When, IntegerField


class GameListView(generic.ListView):
    model = Game
    context_object_name = "game_list"
    template_name = "lists/game/game_list.html"
    paginate_by = 10

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super(GameListView, self).get_context_data(**kwargs)

        sort_by = self.request.GET.get("sort", "status_priority")
        context["sort_by"] = sort_by

        name = self.request.GET.get("name", "")
        context["search_form"] = NameSearchForm(initial={"name": name})

        return context

    def get_queryset(self):
        queryset = Game.objects.all()

        form = NameSearchForm(self.request.GET)
        if form.is_valid():
            queryset = queryset.filter(name__icontains=form.cleaned_data["name"])

        queryset = queryset.annotate(
            status_priority=Case(
                When(status="active", then=1),
                When(status="pending", then=2),
                When(status="completed", then=3),
                default=4,
                output_field=IntegerField(),
            )
        )

        sort_by = self.request.GET.get("sort", "status_priority")

        valid_sort_fields = ["status_priority", "name", "id", "coop"]
        if sort_by in valid_sort_fields:
            queryset = queryset.order_by(sort_by)

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
