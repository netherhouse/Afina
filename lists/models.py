from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class StatusChoices(models.TextChoices):
    PENDING = "pending", "Pending"
    ACTIVE = "active", "Active"
    COMPLETED = "completed", "Completed"


# CRUD +
class Movie(models.Model):
    name = models.CharField(
        max_length=255
    )
    description = models.TextField(
        blank=True,
        null=True
    )
    rate = models.IntegerField(
        null = True,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING.value,
    )

    def __str__(self):
        return self.name


# CRUD -
class Game(models.Model):
    KOOP_CHOICES = [
        ('solo', 'Solo'),
        ('double', 'Double'),
        ('team', 'Team'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING.value,
    )
    rate = models.IntegerField(
        null=True,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    review = models.TextField(
        blank=True,
        null=True
    )
    koop = models.CharField(
        max_length=20,
        choices=KOOP_CHOICES,
        default='Solo',
    )

    def __str__(self):
        return self.name


# CRUD -
class Event(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.name


# CRUD -
class Idea(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING.value,
    )

    def __str__(self):
        return self.name


# CRUD -
class Desire(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.BooleanField(default=False)
    price = models.FloatField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)


# CRUD -
class Goal(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.BooleanField(default=False)


# CRUD -
class SubTask(models.Model):
    name = models.CharField(max_length=255)
    status = models.BooleanField(default=False)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE)
