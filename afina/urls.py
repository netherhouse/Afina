from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from lists.views import index

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("django.contrib.auth.urls")),
    path('afina/', index, name='index'),
    path("afina/lists/", include("lists.urls", namespace="lists")),
    path("afina/finances/", include("finances.urls", namespace="finances")),
    path("", include("website.urls", namespace="website")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
