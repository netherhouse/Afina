from django.contrib import admin

from lists import models

admin.site.register(models.Movie)
admin.site.register(models.Game)
admin.site.register(models.Event)
admin.site.register(models.Desire)
admin.site.register(models.Goal)
admin.site.register(models.SubTask)
