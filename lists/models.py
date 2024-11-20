from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Movie(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    rate = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    status = models.BooleanField()


class Game(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    status = models.BooleanField()


class Event(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()


class Idea(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
