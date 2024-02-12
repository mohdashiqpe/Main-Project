import random
import secrets
import string


def generate_otp(length=6):
    characters = string.digits  # Use digits (0-9) for OTP generation
    otp = ''.join(random.choice(characters) for _ in range(length))
    return otp

def generate_fake_password(length=8):
    characters = string.ascii_letters + string.digits
    fake_password = ''.join(random.choice(characters) for _ in range(length))
    return fake_password