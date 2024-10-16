from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    path('register/', UserRegisterationView.as_view()),
    path('login/', UserLoginView.as_view()),
    path('user/profile/', UserProfileView.as_view()),
    path('user/change_password/', userChangePasswordView.as_view()),
    path('user/email_verify/', emailVerifyUsingOtpView.as_view()),
    path('resend_otp/', resendOtpView.as_view()),
    path('user/save_profile/',SaveProfileView.as_view()),
    path('user/upload/profile_image/',userProfileImageUploadView.as_view()),
   
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)