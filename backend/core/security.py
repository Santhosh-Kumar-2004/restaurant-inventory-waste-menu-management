from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Argon2 configuration (safe defaults)
password_hasher = PasswordHasher(
    time_cost=3,
    memory_cost=65536,  # 64 MB
    parallelism=4,
    hash_len=32,
    salt_len=16,
)

def hash_password(password: str) -> str:
    """
    Hash a plain password using Argon2.
    Salt is generated automatically.
    """
    return password_hasher.hash(password)


def verify_password(hashed_password: str, plain_password: str) -> bool:
    """
    Verify a password against its hash.
    """
    try:
        return password_hasher.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False
