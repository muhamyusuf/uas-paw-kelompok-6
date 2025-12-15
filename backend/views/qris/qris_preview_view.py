"""Generate preview of dynamic QRIS without saving"""
import base64
import io
import json
from pyramid.view import view_config
import qrcode

from helpers.qris_helper import generate_dynamic_qris_string
from helpers.jwt_validate_helper import jwt_validate


@view_config(route_name="qris_preview", request_method="POST", renderer="json")
@jwt_validate
def qris_preview(request):
    """
    POST /api/qris/preview
    Generate preview of dynamic QRIS QR code without saving to database
    
    Request (JSON):
    {
        \"staticQrisString\": \"00020126450014com.midtrans...\",
        \"jumlahBayar\": 1000000,
        \"feeType\": \"rupiah\",
        \"feeValue\": 10000
    }
    
    Response (200 OK):
    {
        \"base64Qr\": \"iVBORw0KGgoAAAANSUhEUgAA...\",
        \"dynamicQrisString\": \"00020126...\"
    }
    """
    try:
        # Parse JSON body
        try:
            body = request.json_body
        except (ValueError, json.JSONDecodeError):
            request.response.status = 400
            return {"error": "Invalid JSON body"}
        
        # Validate required fields
        static_qris_string = body.get("staticQrisString", "").strip()
        jumlah_bayar = body.get("jumlahBayar")
        fee_type = body.get("feeType", "").strip() or None
        fee_value = body.get("feeValue")
        
        if not static_qris_string:
            request.response.status = 400
            return {"error": "staticQrisString is required"}
        
        if jumlah_bayar is None:
            request.response.status = 400
            return {"error": "jumlahBayar is required"}
        
        # Parse numeric values
        try:
            jumlah_bayar = float(jumlah_bayar)
            if jumlah_bayar < 0:
                raise ValueError("jumlahBayar must be >= 0")
        except (ValueError, TypeError):
            request.response.status = 400
            return {"error": "jumlahBayar must be a valid number"}
        
        if fee_value is not None:
            try:
                fee_value = float(fee_value)
                if fee_value < 0:
                    raise ValueError("feeValue must be >= 0")
            except (ValueError, TypeError):
                request.response.status = 400
                return {"error": "feeValue must be a valid number"}
        
        if fee_type and fee_type not in ["persentase", "rupiah"]:
            request.response.status = 400
            return {"error": "feeType must be 'persentase' or 'rupiah'"}
        
        # Generate dynamic QRIS string
        try:
            dynamic_qris_string = generate_dynamic_qris_string(
                static_qris_string,
                jumlah_bayar,
                fee_type,
                fee_value
            )
        except ValueError as e:
            request.response.status = 400
            return {"error": str(e)}
        
        # Generate QR code
        try:
            qr = qrcode.QRCode(
                version=None,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(dynamic_qris_string)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format="PNG")
            img_byte_arr.seek(0)
            
            base64_qr = base64.b64encode(img_byte_arr.getvalue()).decode("utf-8")
        except Exception as e:
            request.response.status = 400
            return {"error": f"Failed to generate QR code: {str(e)}"}
        
        return {
            "base64Qr": base64_qr,
            "dynamicQrisString": dynamic_qris_string,
        }
    
    except Exception as e:
        request.response.status = 500
        return {"error": f"Internal server error: {str(e)}"}
