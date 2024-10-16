from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import * #  UserRegisterationSerializers, UserLoginSerializers, UserProfileSerializers, userChangePasswordSerializers, emailVerifyUsingOtpSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.renderer import CustomRenderers
from rest_framework.permissions import IsAuthenticated
from accounts.models import MyUser




# Generate Tokens Manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def send_otp(user):
    user.generate_otp()
    # Logic to send email with the OTP


class UserRegisterationView(APIView):
    renderer_classes  = [CustomRenderers]
    def post(self,request):
        
        serializers = UserRegisterationSerializers(data = request.data)
        print("data -> ", request.data)
        if serializers.is_valid():
            user = serializers.save()
            send_otp(user=user)
            token = get_tokens_for_user(user)
            print("User Saved -> ", user)
            return Response({'msg':'Register Success',
                             'tokens':token,
                             'data':str(serializers.data)},
                             status=status.HTTP_201_CREATED)
        

        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    renderer_classes  = [CustomRenderers]
    def post(self, request):
        serializer = UserLoginSerializers(data = request.data)
        print("request : -> ",request)
        print("request data -> ", request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(email = email, password = password)
            if user: 
                token = get_tokens_for_user(user)
                return Response({'msg':'Login Success',
                                 'is_profile_complete': user.is_profile_complete,
                                 'is_verified':user.is_verified,
                                 'tokens':token},
                            status=status.HTTP_200_OK)
            else:
                return Response({'errors':{
                    'non_field_errors':['Email or Password is Not Valid']
                }},
                    status = status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




class UserProfileView(APIView):
    renderer_classes = [CustomRenderers]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        print(request.user)
        serializer = UserProfileSerializers(request.user)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class userChangePasswordView(APIView):
    renderer_classes = [CustomRenderers]

    def post(self,request):
        serializer = userChangePasswordSerializers(data = request.data)
        print("reset password user data -> ", request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = get_object_or_404(MyUser, email=email)
            user.set_password(password)
            user.save()
            return  Response({'message':'Password Change Success'},status=status.HTTP_200_OK)
        return  Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



class emailVerifyUsingOtpView(APIView):
    renderer_classes = [CustomRenderers]

    def post(self,request):
        serializer = emailVerifyUsingOtpSerializer(data= request.data)
        
        if serializer.is_valid():
            return  Response({'msg':'Email Verify Success'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)




class SaveProfileView(APIView):
    renderer_classes = [CustomRenderers]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = saveProfileSerializer(data=request.data, context={'user': user})
        print('user data -> ',  request.data)

        if serializer.is_valid():
            # Update the user object with validated data
            for field, value in serializer.validated_data.items():
                setattr(user, field, value)
            
            user.is_profile_complete = True
            user.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


 

class userProfileImageUploadView(APIView):
    renderer_classes = [CustomRenderers]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        serializer = userProfileImageUploadSerializer(data = request.data)
        if serializer.is_valid():
            user = request.user
            user.profile_image = serializer.validated_data['profile_image']  # Save the validated image
            user.save()  # Don't forget to save the user object
            
            print("Image uploaded successfully. -> ", serializer.validated_data['profile_image'])
            return Response({'message': 'Image uploaded successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):

        user = request.user
        if user:
            print(user)
            if user.profile_image:
                return Response({'profile_image':user.profile_image.url}, status=status.HTTP_200_OK)
            return  Response({'message': 'No profile image'}, status=status.HTTP_200_OK)

        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    

            
    



class resendOtpView(APIView):
    renderer_classes = [CustomRenderers]

    def post(self, request):
        serializer = resendOtpSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Use get_object_or_404 to handle user lookup
            user = get_object_or_404(MyUser, email=email)
            
            if not user.is_verified:
                send_otp(user)
                return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Your account is already verified'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        

       


      
   