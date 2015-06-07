# from __future__ import unicode_literals

import random

from django.utils.translation import ugettext as _
from django.http import Http404
from django.views.generic.detail import DetailView

from models import Lines, World


class LinesDetailView(DetailView):

    model = Lines
    template_name = "lines/lines_detail.html"

    def generate_obj(self, pk):

        random.seed(pk)

        line_1 = ["line1", 0]
        line_2 = ["line2", 0]
        for i in xrange(4):
            line_1.append(random.randint(0, 26))

        for i in xrange(4):
            line_2.append(random.randint(-17, 10))
        
        random_obj = {}
        random_obj["data"] = {"y_min": -20, "y_max": 30, "y_step": 10,
                      "years": [2010, 2011, 2012, 2013, 2014],
                      "data": {
                                "columns": [      
                                    line_1,
                                    line_2
                                ]
                       }
                      }
        return random_obj

    def get_object(self):
        try:
            object = super(LinesDetailView, self).get_object()
        except:
            pk = self.kwargs.get(self.pk_url_kwarg, None)
            object = self.generate_obj(pk)
        
        return object

    def get_context_data(self, **kwargs):
        context = super(LinesDetailView, self).get_context_data(**kwargs)
        context['title'] = 'Line Graph'
        context['outcome'] = self.request.GET.get("outcome", None)
        context['object_id'] = self.kwargs.get(self.pk_url_kwarg, None)
        return context


class WorldDetailView(DetailView):

    model = World
    template_name = "world/world_detail.html"

    def generate_obj(self, pk):

        random.seed(pk)

        values = []
        for i in xrange(10):
            values.append(random.randint(0, 100))
        
        random_obj = {}
        random_obj["data"] = {
                                "United States of America": {
                                    "v1": values[0]
                                },
                                "Canada": {
                                    "v1": values[1]
                                },
                                "China": {
                                    "v1": values[2]
                                },
                                "Germany": {
                                    "v1": values[3]
                                },
                                "Italy": {
                                    "v1": values[4]
                                },
                                "Russia": {
                                    "v1": values[5]
                                },
                                "Argentina": {
                                    "v1": values[6]
                                },
                                "Democratic Republic of the Congo": {
                                    "v1": values[7]
                                },
                                "Australia": {
                                    "v1": values[8]
                                },
                                "Saudi Arabia": {
                                    "v1": values[9]
                                }
                            }
        return random_obj

    def get_object(self):
        try:
            object = super(WorldDetailView, self).get_object()
        except:
            pk = self.kwargs.get(self.pk_url_kwarg, None)
            object = self.generate_obj(pk)
        
        return object

    def get_context_data(self, **kwargs):
        context = super(WorldDetailView, self).get_context_data(**kwargs)
        context['title'] = 'World Graph'
        context['outcome'] = self.request.GET.get("outcome", None)
        context['object_id'] = self.kwargs.get(self.pk_url_kwarg, None)
        return context
