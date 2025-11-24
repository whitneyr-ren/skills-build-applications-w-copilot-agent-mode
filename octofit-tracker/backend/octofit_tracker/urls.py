"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
import os


def api_root(_request):
    """Return base API information including dynamic Codespace base URL.

    We construct the public HTTPS base URL using $CODESPACE_NAME so clients
    can reliably form endpoint URLs without hardcoding the value.
    Format: https://$CODESPACE_NAME-8000.app.github.dev/api/[component]/
    """
    codespace = os.environ.get('CODESPACE_NAME')
    base_url = (
        f"https://{codespace}-8000.app.github.dev/api/" if codespace else "http://localhost:8000/api/"
    )
    return JsonResponse({
        "base_api_url": base_url,
        "examples": {
            "activities": f"{base_url}activities/",
        }
    })


def activities_view(_request):
    """Simple placeholder activities endpoint.

    In a future iteration this should query real activity data. Provided now
    to validate URL routing over Codespaces without modifying views.py.
    """
    codespace = os.environ.get('CODESPACE_NAME')
    base_host = f"{codespace}-8000.app.github.dev" if codespace else "localhost:8000"
    return JsonResponse({
        "endpoint": "/api/activities/",
        "host": base_host,
        "data": [],
        "message": "Activities list placeholder"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/activities/', activities_view, name='activities'),
]
