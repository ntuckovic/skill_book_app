from django.conf.urls import url

from views import LinesDetailView, WorldDetailView

urlpatterns = [
    url(r'^lines/(?P<pk>[0-9]+)/$', LinesDetailView.as_view(), name='lines-detail'),
    url(r'^world/(?P<pk>[0-9]+)/$', WorldDetailView.as_view(), name='world-detail'),
]