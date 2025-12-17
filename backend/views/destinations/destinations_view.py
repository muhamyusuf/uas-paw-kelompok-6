from db import Session
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound, IntegrityError
from typing import Optional
from pyramid.view import view_config
from pydantic import BaseModel, ValidationError
from pyramid.response import Response
from models.destination_model import Destination
from . import serialization_data
from helpers.jwt_validate_helper import jwt_validate
import os
import uuid
from pathlib import Path


class DestinationRequest(BaseModel):
    country: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    photo_url: Optional[str] = None


@view_config(route_name="destinations", request_method="GET", renderer="json")
def destinations(request):
    # request validation
    try:
        req_data = DestinationRequest(**request.params.mixed())
    except ValidationError as err:
        return Response(json_body={"error": str(err.errors())}, status=400)

    # get destination from db
    with Session() as session:
        stmt = select(
            Destination
        )  # building the query step by step if the url have some parameters
        if req_data.country is not None:
            stmt = stmt.where(Destination.country == req_data.country)
        if req_data.name is not None:
            stmt = stmt.where(Destination.name == req_data.name)

        try:
            result = (
                session.execute(stmt).scalars().all()
            )  # agar kembalikan semua, atau tidak sama sekali (imo gitu sih, cmiiw)
            return [
                serialization_data(dest) for dest in result
            ]  # serialisasikan semua destinasi yang ada dari .all()
        except Exception as e:
            print(e)
            return Response(json_body={"error": "Internal Server Error"}, status=500)


@view_config(route_name="destination_detail", request_method="GET", renderer="json")
def destination_detail(request):
    dest_id = request.matchdict.get("id")
    with Session() as session:
        stmt = select(Destination).where(Destination.id == dest_id)
        try:
            result = session.execute(stmt).scalars().one()  # tampilkan 1 data
            return serialization_data(result)  # serialisasikan
        except NoResultFound:
            return Response(json_body={"error": "Destination not founfd"}, status=404)
        except Exception as e:
            print(e)
            return Response(
                json_body={"error": "Invalid ID or server error"}, status=400
            )


@view_config(route_name="destinations", request_method="POST", renderer="json")
@jwt_validate
def create_destinations(request):
    #agent forbidden 
    if request.jwt_claims["role"] != "agent":
        return Response(
            json_body={"error": "Forbidden : Only agent can access"}, status=403
        )
    
    #create storage dir 
    storage_dir = Path("storage/destinations")
    storage_dir.mkdir(parents=True, exist_ok=True)


    try:
        photo_url= None
        if "photo" in request.POST:
            photo_file = request.POST.get("photo")

            if photo_file and hasattr(photo_file,'filename'):
                filename = photo_file.filename
                if filename and filename != '':
                    allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
                    file_ext = Path(filename).suffix.lower()

                    if file_ext not in allowed_extensions:
                        return Response(json_body={"error": f"File type not allowed. Allowed: {', '.join(allowed_extensions)}"}, status=400)

                    file_content = photo_file.file.read()
                    if len(file_content) > 5 * 1024 * 1024:
                        return Response(json_body={"error": "File size exceeds 5MB limit"}, status=400)

                    unique_filename = f"{uuid.uuid4()}{file_ext}"
                    file_path = storage_dir / unique_filename
                   
                    with open(file_path, 'wb') as f:
                        f.write(file_content)
                    
                    photo_url = f"/destination/{unique_filename}"

        if request.content_type and 'application/json' in request.content_type:
            req_data = DestinationRequest(**request.json_body)
        else:
            # Form data
            form_dict = {
                "name": request.POST.get("name"),
                "description": request.POST.get("description"),
                "country": request.POST.get("country"),
                "photo_url": photo_url or request.POST.get("photo_url")
            }
            req_data = DestinationRequest(**form_dict)

    except ValidationError as err:
        return Response(json_body={"error": str(err.errors())}, status=400)
    except Exception as e:
        return Response(json_body={"error": f"Invalid request: {str(e)}"}, status=400)

    with Session() as session:
        #create new destination
        new_destination = Destination(
            name = req_data.name,
            description= req_data.description,
            photo_url= req_data.photo_url,
            country = req_data.country,
        )

        try:
            #save to database
            session.add(new_destination)
            session.commit()
            session.refresh(new_destination)
            return serialization_data(new_destination)
        except IntegrityError as err:
            session.rollback()
            return Response(json_body={"error": str(err.orig)}, status=409)
        except Exception as e:
            session.rollback()
            print(f"CRITICAL ERROR: {e}")
            return Response(
                json_body={"error": f"Internal Server Error: {str(e)}"}, status=500
            )
