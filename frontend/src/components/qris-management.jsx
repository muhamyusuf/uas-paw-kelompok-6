import { useState, useEffect, useRef } from "react";
import { QrCode, Upload, Trash2, Plus, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import * as qrisService from "@/services/qris.service";
import { API_BASE_URL } from "@/services/api";

export function QRISManagement() {
  const [qrisList, setQrisList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [feeType, setFeeType] = useState("rupiah");
  const [feeValue, setFeeValue] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchQRIS();
  }, []);

  const fetchQRIS = async () => {
    setIsLoading(true);
    try {
      const data = await qrisService.getAllQRIS();
      console.log("QRIS List:", data);
      setQrisList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch QRIS:", error);
      toast.error("Failed to load QRIS codes");
      setQrisList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    // Validate fee value if provided
    if (feeValue && isNaN(parseFloat(feeValue))) {
      toast.error("Fee value must be a number");
      return;
    }

    setIsUploading(true);
    try {
      const parsedFeeValue = feeValue ? parseFloat(feeValue) : undefined;
      await qrisService.createQRIS(selectedFile, feeType, parsedFeeValue);
      
      toast.success("QRIS uploaded successfully!");
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setFeeType("rupiah");
      setFeeValue("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setDialogOpen(false);
      
      // Refresh list
      await fetchQRIS();
    } catch (error) {
      console.error("Failed to upload QRIS:", error);
      toast.error(error.response?.data?.error || "Failed to upload QRIS");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this QRIS code?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await qrisService.deleteQRIS(id);
      toast.success("QRIS deleted successfully!");
      await fetchQRIS();
    } catch (error) {
      console.error("Failed to delete QRIS:", error);
      toast.error(error.response?.data?.error || "Failed to delete QRIS");
    } finally {
      setIsDeleting(null);
    }
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QRIS Management
            </CardTitle>
            <CardDescription>
              Upload and manage QRIS codes for payment collection
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload QRIS
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New QRIS</DialogTitle>
                <DialogDescription>
                  Upload a QRIS code image for payment collection
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label>QRIS Image *</Label>
                  <div className="flex flex-col gap-2">
                    {previewUrl && (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="QRIS Preview"
                          className="h-48 w-full rounded-lg border object-contain"
                        />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="qris-file-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {previewUrl ? "Change Image" : "Select Image"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accepted: PNG, JPEG, JPG (Max 5MB)
                  </p>
                </div>

                {/* Fee Type */}
                <div className="space-y-2">
                  <Label>Fee Type (Optional)</Label>
                  <Select value={feeType} onValueChange={setFeeType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rupiah">Fixed Amount (Rupiah)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fee Value */}
                <div className="space-y-2">
                  <Label>
                    Fee Value (Optional)
                    {feeType === "percentage" && " (%)"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={feeType === "percentage" ? "e.g., 2.5" : "e.g., 10000"}
                    value={feeValue}
                    onChange={(e) => setFeeValue(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {feeType === "percentage" 
                      ? "Service fee as percentage of payment amount" 
                      : "Fixed service fee in Rupiah"}
                  </p>
                </div>

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload QRIS
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {qrisList.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No QRIS codes uploaded yet. Upload your first QRIS code to start accepting payments.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {qrisList.map((qris) => (
              <Card key={qris.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* QRIS Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={getFullUrl(qris.foto_qr_url || qris.fotoQrUrl)}
                        alt="QRIS Code"
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23f0f0f0" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999">No image</text></svg>';
                        }}
                      />
                    </div>

                    {/* QRIS Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          <ImageIcon className="mr-1 h-3 w-3" />
                          QRIS Code
                        </Badge>
                        {qris.is_active !== false && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                            Active
                          </Badge>
                        )}
                      </div>

                      {(qris.fee_type || qris.feeType) && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Fee:</p>
                          <p className="font-medium">
                            {qris.fee_type === "percentage" || qris.feeType === "percentage"
                              ? `${qris.fee_value || qris.feeValue}%`
                              : `Rp ${(qris.fee_value || qris.feeValue)?.toLocaleString()}`}
                          </p>
                        </div>
                      )}

                      {(qris.created_at || qris.createdAt) && (
                        <p className="text-xs text-muted-foreground">
                          Uploaded {new Date(qris.created_at || qris.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDelete(qris.id)}
                      disabled={isDeleting === qris.id}
                    >
                      {isDeleting === qris.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}