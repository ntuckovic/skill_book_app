from django.db import models

class Lines(models.Model):
    data = models.TextField()


class World(models.Model):
    data = models.TextField()