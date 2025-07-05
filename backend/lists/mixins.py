from .forms import NameSearchForm


class SearchFormMixin:
    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        name = self.request.GET.get("name", "")
        context["search_form"] = NameSearchForm(initial={"name": name})
        return context


class NameSearchMixin:
    def get_queryset(self):
        queryset = self.model.objects.all()
        form = NameSearchForm(self.request.GET)
        if form.is_valid():
            queryset = queryset.filter(name__icontains=form.cleaned_data["name"])
        return queryset
