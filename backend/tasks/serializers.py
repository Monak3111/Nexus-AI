from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source="created_by.username",
        read_only=True,
    )

    assigned_to_name = serializers.CharField(
        source="assigned_to.username",
        read_only=True,
    )

    project_name = serializers.CharField(
        source="project.name",
        read_only=True,
    )

    class Meta:
        model = Task

        fields = [
            "id",
            "project",
            "project_name",
            "title",
            "description",
            "created_by",
            "created_by_name",
            "assigned_to",
            "assigned_to_name",
            "status",
            "priority",
            "due_date",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "created_by",
            "created_by_name",
            "assigned_to_name",
            "project_name",
            "created_at",
            "updated_at",
        ]