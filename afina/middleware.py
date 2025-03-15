from django.shortcuts import redirect
from django.urls import reverse


class LoginRequiredMiddleware:
    """Redirect all non-auth users from /afina to /login"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/afina/") and not request.user.is_authenticated:
            return redirect(f"{reverse('login')}?next={request.path}")
        return self.get_response(request)
