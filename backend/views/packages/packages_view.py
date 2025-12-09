import jwt
from pydantic import BaseModel, ValidationError
from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import NoResultFound
from sqlalchemy import select
from db import Session
from models.user_model import User

class FromRequest(BaseModel):
    destinationId: str
    name: str
    duration: int
    price: int
    itinerary: str
    maxTraveler: int
    contactPhone: str
    images: list[str]

@view_config(route_name="packages", request_method="POST", renderer="json")
def packages(request):
    # request validation
    try:
        req_data = FromRequest(**request.json_body)
    except ValidationError as err:
        return Response(json_body={"error": str(err.errors())}, status=400)
    # get header
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return Response(json_body={"error": "Missing Token"}, status=401)
    try:
        token_type, token = auth_header.split(" ", 1)
        if token_type != "Bearer":
            raise ValueError("Invalid token type")
    except ValueError:
        return Response(
            json_body={"error": "Invalid Authorization header format"}, status=401
        )

    return {
    }
