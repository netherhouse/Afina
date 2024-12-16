from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("lists/", include("lists.urls", namespace="lists")),
    path("finances/", include("finances.urls", namespace="finances")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
