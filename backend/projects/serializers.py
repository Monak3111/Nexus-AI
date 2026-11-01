from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    manager_name = serializers.CharField(
        source="manager.username",
        read_only=True,
    )

    class Meta:
        model = Project

        fields = [
            "id",
            "name",
            "description",
            "manager",
            "manager_name",
            "members",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "manager",
            "manager_name",
            "created_at",
            "updated_at",
        ]