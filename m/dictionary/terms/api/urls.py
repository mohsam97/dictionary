from django.urls import path
from .views import TermListView,CategoryListView,TagListView

urlpatterns = [
    path('terms/', TermListView.as_view()),
    path('Category/', CategoryListView.as_view()),
    path('tags/', TagListView.as_view()),
]