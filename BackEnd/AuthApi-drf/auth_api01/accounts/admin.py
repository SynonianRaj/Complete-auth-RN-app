from django.contrib import admin

# Register your models here.
from accounts.models import MyUser
from django import forms
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = MyUser
        fields = ["email", "password", "date_of_birth", "is_active", "is_admin"]


class UserModelAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    readonly_fields = ("created_at", "updated_at","otp_expiration","otp")
    # add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["email","id", "date_of_birth", "first_name", "last_name" ,"gender","is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        ('User Credentials', {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["profile_image","first_name", "last_name", "date_of_birth", "gender", "phone", "age","weight","height", "created_at", "updated_at"]}),
        ("Permissions", {"fields": ["is_admin", "is_verified","is_profile_complete","otp_expiration","otp",]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "first_name", "last_name","weight","height" , "date_of_birth", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email"]
    filter_horizontal = []

admin.site.register(MyUser, UserModelAdmin) 