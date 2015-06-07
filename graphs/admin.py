from django.contrib import admin

from .models import Lines, World


admin.site.register(World)


class LinesAdmin(admin.ModelAdmin):
    model = Lines
    list_display = ('id',)

admin.site.register(Lines, LinesAdmin)