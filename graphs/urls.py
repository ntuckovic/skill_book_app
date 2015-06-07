from django.conf.urls import url

from views import LinesDetailView

urlpatterns = [
    url(r'^lines/(?P<pk>[0-9]+)/$', LinesDetailView.as_view(), name='lines-detail'),
]