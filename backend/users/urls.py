from django.urls import path

from .views import (
    ProfileView,
    RegisterView,
    UserListView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("users/", UserListView.as_view(), name="users"),
    path("profile/", ProfileView.as_view(), name="profile"),
]