from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from lists.views import index

urlpatterns = [
    path('afina/', index, name='index'),
    path("admin/", admin.site.urls),
    path("lists/", include("lists.urls", namespace="lists")),
    path("finances/", include("finances.urls", namespace="finances")),
    path("", include("website.urls", namespace="website")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
