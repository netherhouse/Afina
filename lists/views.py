import json

from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import generic
from django.db.models import Case, When, IntegerField
from django.views.decorators.csrf import csrf_exempt

from lists.forms import NameSearchForm, EventForm
from lists.mixins import SearchFormMixin, NameSearchMixin
from lists.models import Movie, Game, Event, Idea, Desire


def index(request):
    return render(request, "index.html")


# region ---------- Movie Views  ----------
class MovieListView(
    SearchFormMixin,
    NameSearchMixin,
    generic.ListView,
):
    model = Movie
    context_object_name = "movie_list"
    template_name = "lists/movie/movie_list.html"
    paginate_by = 10


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


# endregion


# region ---------- Game Views  ----------
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


# endregion


# region ---------- Event Views  ----------
class EventListView(
    SearchFormMixin,
    NameSearchMixin,
    generic.ListView
):
    model = Event
    context_object_name = "event_list"
    template_name = "lists/event/event_list.html"
    paginate_by = 10


class EventCreateView(generic.CreateView):
    model = Event
    form_class = EventForm
    success_url = reverse_lazy("lists:event-list")
    template_name = "lists/event/event_form.html"


class EventDetailView(generic.DetailView):
    model = Event
    template_name = "lists/event/event_detail.html"


class EventUpdateView(generic.UpdateView):
    model = Event
    fields = "__all__"
    success_url = reverse_lazy("lists:event-list")
    template_name = "lists/event/event_form.html"


class EventDeleteView(generic.DeleteView):
    model = Event
    success_url = reverse_lazy("lists:event-list")
    template_name = "lists/event/event_confirm_delete.html"


# endregion


# region ---------- Idea Views  ----------
class IdeaListView(
    SearchFormMixin,
    NameSearchMixin,
    generic.ListView
):
    model = Idea
    context_object_name = "idea_list"
    template_name = "lists/idea/idea_list.html"
    paginate_by = 10


class IdeaCreateView(generic.CreateView):
    model = Idea
    fields = "__all__"
    success_url = reverse_lazy("lists:idea-list")
    template_name = "lists/idea/idea_form.html"


class IdeaDetailView(generic.DetailView):
    model = Idea
    template_name = "lists/idea/idea_detail.html"


class IdeaUpdateView(generic.UpdateView):
    model = Idea
    fields = "__all__"
    success_url = reverse_lazy("lists:idea-list")
    template_name = "lists/idea/idea_form.html"


class IdeaDeleteView(generic.DeleteView):
    model = Idea
    success_url = reverse_lazy("lists:idea-list")
    template_name = "lists/idea/idea_confirm_delete.html"
# endregion


# region ---------- Desire Views  ----------
class DesireListView(
    SearchFormMixin,
    NameSearchMixin,
    generic.ListView
):
    model = Desire
    context_object_name = "desire_list"
    template_name = "lists/desire/desire_list.html"
    paginate_by = 10


class DesireCreateView(generic.CreateView):
    model = Desire
    fields = "__all__"
    success_url = reverse_lazy("lists:desire-list")
    template_name = "lists/desire/desire_form.html"


class DesireDetailView(generic.DetailView):
    model = Desire
    template_name = "lists/desire/desire_detail.html"


class DesireUpdateView(generic.UpdateView):
    model = Desire
    fields = "__all__"
    success_url = reverse_lazy("lists:desire-list")
    template_name = "lists/desire/desire_form.html"


class DesireDeleteView(generic.DeleteView):
    model = Desire
    success_url = reverse_lazy("lists:desire-list")
    template_name = "lists/desire/desire_confirm_delete.html"


@csrf_exempt
def desire_update_status(request, id):
    if request.method == 'POST':
        try:
            print("here")
            desire = Desire.objects.get(id=id)
            data = json.loads(request.body)
            new_status = data.get('status') == 'true'
            desire.status = new_status
            desire.save()
            return JsonResponse({'success': True})
        except Desire.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Desire not found'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON'})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})
# endregion
