
import os
import django
from datetime import date, timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model
from projects.models import Project
from tasks.models import Task

User = get_user_model()
user = User.objects.filter(is_active=True).order_by("id").first()

if user is None:
    print("No active user found. Register an account first.")
else:
    demo_projects = [
        {
            "name": "E-Commerce Platform",
            "description": "Build an online store with product search, cart, checkout, and payments.",
            "tasks": [
                ("Develop Product API", "Build product listing and search endpoints.", "IN_PROGRESS", "HIGH", 3),
                ("Implement Login API", "Finish JWT login and authentication.", "DONE", "URGENT", -1),
                ("Build Shopping Cart", "Allow customers to add and remove products.", "TODO", "HIGH", 5),
                ("Integrate Payments", "Handle payments and transaction status.", "IN_REVIEW", "URGENT", 2),
            ],
        },
        {
            "name": "Customer Analytics Dashboard",
            "description": "Track sales, customer engagement, and conversion rates.",
            "tasks": [
                ("Design Analytics UI", "Create responsive charts and summary cards.", "DONE", "MEDIUM", -2),
                ("Build Analytics API", "Calculate customer and sales metrics.", "IN_PROGRESS", "HIGH", 4),
                ("Add Date Filters", "Support weekly and monthly reporting.", "TODO", "MEDIUM", 7),
                ("Test Analytics Data", "Verify dashboard metrics.", "TODO", "HIGH", 8),
            ],
        },
        {
            "name": "Employee Onboarding Portal",
            "description": "Manage employee onboarding steps and document submissions.",
            "tasks": [
                ("Create Onboarding Workflow", "Define onboarding stages.", "DONE", "MEDIUM", -3),
                ("Build Employee Profile", "Create the employee information form.", "IN_PROGRESS", "HIGH", 3),
                ("Add Document Uploads", "Support secure document submissions.", "TODO", "HIGH", 6),
                ("Create Progress Report", "Track onboarding completion.", "TODO", "LOW", 9),
            ],
        },
        {
            "name": "Marketing Website Redesign",
            "description": "Improve website navigation, responsive layouts, and performance.",
            "tasks": [
                ("Design Homepage", "Create a modern responsive homepage.", "DONE", "HIGH", -8),
                ("Build Navigation", "Implement desktop and mobile navigation.", "DONE", "MEDIUM", -7),
                ("Optimize Performance", "Improve page loading speed.", "DONE", "HIGH", -5),
                ("Test Website", "Check responsive layouts and browsers.", "DONE", "MEDIUM", -2),
            ],
        },
    ]

    for item in demo_projects:
        project, created = Project.objects.get_or_create(
            name=item["name"],
            defaults={
                "description": item["description"],
                "manager": user,
                "status": "ACTIVE",
            },
        )

        if hasattr(project, "members"):
            project.members.add(user)

        for title, description, status, priority, days in item["tasks"]:
            Task.objects.get_or_create(
                project=project,
                title=title,
                defaults={
                    "description": description,
                    "created_by": user,
                    "assigned_to": user,
                    "status": status,
                    "priority": priority,
                    "due_date": date.today() + timedelta(days=days),
                },
            )

    print("Demo data setup complete!")
    print("Projects:", Project.objects.count())
    print("Tasks:", Task.objects.count())
