from pydantic import BaseModel, ValidationError, Field
from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import NoResultFound, IntegrityError
from sqlalchemy import select
from db import Session
from models.user_model import User
from models.package_model import Package
from helpers.jwt_validate_helper import jwt_validate

class FromRequest(BaseModel):
    destinationId: str
    name: str
    duration: int = Field(gt=0)
    price: int = Field(gt=0)
    itinerary: str
    maxTraveler: int = Field(gt=0)
    contactPhone: str
    images: list[str]

@view_config(route_name="packages", request_method="POST", renderer="json")
@jwt_validate
def packages(request):
    # request validation
    try:
        req_data = FromRequest(**request.json_body)
    except ValidationError as err:
        return Response(json_body={"error": str(err.errors())}, status=400)
    # check agentid
    with Session() as session:
        stmt = select(User).where(User.id == request.payload["sub"])
        try:
            result = session.execute(stmt).scalars().one()
            if not result:
                return Response(json_body={"message": "User tidak ditemukan"}, status=401)
        except NoResultFound:
            return Response(json_body={"message": "User tidak ditemukan"}, status=401)
        except Exception as e:
            print(e)
            return Response(json_body={"error": "Internal Server Error"}, status=500)

    # push new package row to db
    with Session() as session:
        new_package = Package(
            agent_id=request.payload["sub"],
            destination_id=req_data.destinationId,
            name=req_data.name,
            duration=req_data.duration,
            price=req_data.price,
            itinerary=req_data.itinerary,
            max_travelers=req_data.maxTraveler,
            contact_phone=req_data.contactPhone,
            images=req_data.images
        )
        try:
            session.add(new_package)
            session.commit()
            package_id = new_package.id
        except IntegrityError as err:
            session.rollback()
            return Response(json_body={"error": str(err.orig)}, status=409)
    

    return {
        "id": str(package_id),
        "agentId": str(result.id),
        "destinationId": "uuid-here",
        "name": result.name,
        "duration": 5,
        "price": 2500.0,
        "itinerary": result.itinerary,
        "maxTravelers": 8,
        "contactPhone": result.contactPhone,
        "images": result.images,
        "reviewsCount": 0
    }
