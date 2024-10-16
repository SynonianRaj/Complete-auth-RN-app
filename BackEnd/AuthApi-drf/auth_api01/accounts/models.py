import random
from django.db import models

# Create your models here.
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils import timezone
from datetime import timedelta



# MANAGER or ADMIN
class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None, password2 =None):
        """
        Creates and saves a User with the given email, date of
        birth, name,tc and password.
        """
        if not email:
            raise ValueError("You must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            password = password,
        
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """
        Creates and saves a superuser with the given email, date of 
        birth, name, tc and password.
        """
        user = self.create_user(
            email = self.normalize_email(email),
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user




# USER or CUSTOMER
class MyUser(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )

    gender_choices = {'Male': 'Male', 'Female':'Female', 'Other':"Other", 'Prefer not to say':"Prefer not to say"}


    # personal Info --- 
    date_of_birth = models.DateField(default=None, null= True,  blank=True)
    first_name = models.CharField(max_length= 50, default=None, blank=True, null=True)
    last_name = models.CharField(max_length=50, default=None, blank=True, null=True)
    age = models.PositiveIntegerField(default=None, blank=True, null=True)
    height = models.PositiveIntegerField(default=None, blank=True, null=True)
    weight = models.PositiveIntegerField(default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    phone = models.PositiveIntegerField(default=None, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_image/', blank=True, default=None, null=True)
    gender = models.CharField(max_length=25, default= None, blank=True, null= True, choices=gender_choices)


    # ------
    otp = models.CharField(max_length=6, blank=True, null = True)  # Assuming a 6-digit OTP
    otp_expiration = models.DateTimeField(blank=True, null = True)
    is_verified = models.BooleanField(default=False)
    is_profile_complete = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, blank=True, null = True)  # Assuming a 6-digit OTP
    otp_expiration = models.DateTimeField(blank=True, null = True)

    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []    #  ["date_of_birth",'name','tc']  

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    def generate_otp(self):
        # Generate OTP logic here
        self.otp = otp() 
        self.otp_expiration = timezone.now() + timedelta(minutes=5)  # Set expiration time to 5 minutes
        self.save()

    # def is_profile_complete(self):
    #     return all([self.first_name, self.last_name, self.date_of_birth, self.age, self.height, self.weight, self.phone])



def otp():
    random_int = random.randint(000000, 999999)
    print(random_int)
    return  random_int

