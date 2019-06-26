from rest_framework.generics import ListAPIView
from django.shortcuts import render
from terms.models import Term,Category,Tag
from .seriailzers import TermSerializer,CatrgorySerializer,TagSerializer


class TermListView (ListAPIView):
    queryset = Term.objects.all()
    serializer_class = TermSerializer

class CategoryListView (ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CatrgorySerializer

class TagListView (ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


