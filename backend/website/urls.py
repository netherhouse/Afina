from django.urls import path
from website.views import (
    index,
    resume,
    contact,
    PortfolioExampleListView,
    CertificateListView,
    document_view
)

app_name = "website"

urlpatterns = [
    path("", index, name='index'),
    path("resume/", resume, name="resume"),
    path("portfolio/", PortfolioExampleListView.as_view(), name="portfolio"),
    path("certificates/", CertificateListView.as_view(), name="certificates"),
    path("contact/", contact, name="contact"),
    path("document/<str:name>/", document_view, name="document")
]
