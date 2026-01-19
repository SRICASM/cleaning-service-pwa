from fastapi import HTTPException, status


class AppException(HTTPException):
    """Base exception for application errors."""
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code


class BadRequestException(AppException):
    def __init__(self, detail: str, error_code: str = "BAD_REQUEST"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code=error_code
        )


class UnauthorizedException(AppException):
    def __init__(self, detail: str = "Not authenticated", error_code: str = "UNAUTHORIZED"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code=error_code
        )


class ForbiddenException(AppException):
    def __init__(self, detail: str = "Access forbidden", error_code: str = "FORBIDDEN"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code=error_code
        )


class NotFoundException(AppException):
    def __init__(self, detail: str = "Resource not found", error_code: str = "NOT_FOUND"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code=error_code
        )


class ConflictException(AppException):
    def __init__(self, detail: str, error_code: str = "CONFLICT"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
            error_code=error_code
        )


class ValidationException(AppException):
    def __init__(self, detail: str, error_code: str = "VALIDATION_ERROR"):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            error_code=error_code
        )


class PaymentException(AppException):
    def __init__(self, detail: str, error_code: str = "PAYMENT_ERROR"):
        super().__init__(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=detail,
            error_code=error_code
        )


class ServiceUnavailableException(AppException):
    def __init__(self, detail: str = "Service temporarily unavailable", error_code: str = "SERVICE_UNAVAILABLE"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail,
            error_code=error_code
        )


# Specific domain exceptions
class UserAlreadyExistsException(ConflictException):
    def __init__(self, email: str):
        super().__init__(
            detail=f"User with email {email} already exists",
            error_code="USER_EXISTS"
        )


class InvalidCredentialsException(UnauthorizedException):
    def __init__(self):
        super().__init__(
            detail="Invalid email or password",
            error_code="INVALID_CREDENTIALS"
        )


class TokenExpiredException(UnauthorizedException):
    def __init__(self):
        super().__init__(
            detail="Token has expired",
            error_code="TOKEN_EXPIRED"
        )


class BookingNotFoundException(NotFoundException):
    def __init__(self, booking_id: int = None, booking_number: str = None):
        identifier = booking_number or f"ID {booking_id}"
        super().__init__(
            detail=f"Booking {identifier} not found",
            error_code="BOOKING_NOT_FOUND"
        )


class BookingCannotBeCancelledException(BadRequestException):
    def __init__(self, reason: str):
        super().__init__(
            detail=f"Booking cannot be cancelled: {reason}",
            error_code="BOOKING_CANCEL_FORBIDDEN"
        )


class InvalidDiscountCodeException(BadRequestException):
    def __init__(self, reason: str):
        super().__init__(
            detail=f"Invalid discount code: {reason}",
            error_code="INVALID_DISCOUNT_CODE"
        )


class PaymentFailedException(PaymentException):
    def __init__(self, reason: str):
        super().__init__(
            detail=f"Payment failed: {reason}",
            error_code="PAYMENT_FAILED"
        )
