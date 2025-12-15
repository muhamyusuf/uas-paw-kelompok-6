import { useRef } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Destination } from "@/types";
import type { PackageFormData } from "@/lib/validations";

interface PackageFormProps {
  formData: {
    name: string;
    destinationId: string;
    duration: string;
    price: string;
    itinerary: string;
    maxTravelers: string;
    contactPhone: string;
  };
  imageFiles: File[];
  imagePreviews: string[];
  errors: Partial<Record<keyof PackageFormData, string>>;
  destinations: Destination[];
  onFieldChange: (field: string, value: string) => void;
  onFilesAdd: (files: FileList | File[]) => void;
  onFileRemove: (index: number) => void;
  canAddMoreFiles: boolean;
}

export function PackageForm({
  formData,
  imageFiles,
  imagePreviews,
  errors,
  destinations,
  onFieldChange,
  onFilesAdd,
  onFileRemove,
  canAddMoreFiles,
}: PackageFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdd(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Filter only image files
      const imgFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (imgFiles.length > 0) {
        onFilesAdd(imgFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  return (
    <div className="space-y-6">
      {/* Package Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Package Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          placeholder="e.g., Amazing Beach Getaway"
        />
        {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <Label htmlFor="destination">Destination *</Label>
        <Select
          value={formData.destinationId}
          onValueChange={(value) => onFieldChange("destinationId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((dest) => (
              <SelectItem key={dest.id} value={dest.id}>
                {dest.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.destinationId && <p className="text-destructive text-sm">{errors.destinationId}</p>}
      </div>

      {/* Duration and Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (days) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="30"
            value={formData.duration}
            onChange={(e) => onFieldChange("duration", e.target.value)}
            placeholder="e.g., 5"
          />
          {errors.duration && <p className="text-destructive text-sm">{errors.duration}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price per Person ($) *</Label>
          <Input
            id="price"
            type="number"
            min="1"
            value={formData.price}
            onChange={(e) => onFieldChange("price", e.target.value)}
            placeholder="e.g., 1200"
          />
          {errors.price && <p className="text-destructive text-sm">{errors.price}</p>}
        </div>
      </div>

      {/* Max Travelers */}
      <div className="space-y-2">
        <Label htmlFor="maxTravelers">Maximum Travelers *</Label>
        <Input
          id="maxTravelers"
          type="number"
          min="1"
          max="50"
          value={formData.maxTravelers}
          onChange={(e) => onFieldChange("maxTravelers", e.target.value)}
          placeholder="e.g., 10"
        />
        {errors.maxTravelers && <p className="text-destructive text-sm">{errors.maxTravelers}</p>}
      </div>

      {/* Contact Phone */}
      <div className="space-y-2">
        <Label htmlFor="contactPhone">WhatsApp Contact Number *</Label>
        <Input
          id="contactPhone"
          type="tel"
          value={formData.contactPhone}
          onChange={(e) => onFieldChange("contactPhone", e.target.value)}
          placeholder="e.g., +628123456789 or 08123456789"
        />
        {errors.contactPhone && <p className="text-destructive text-sm">{errors.contactPhone}</p>}
        <p className="text-muted-foreground text-sm">
          WhatsApp number for tourist inquiries (will create wa.me/ link)
        </p>
      </div>

      {/* Itinerary */}
      <div className="space-y-2">
        <Label htmlFor="itinerary">Itinerary *</Label>
        <Textarea
          id="itinerary"
          value={formData.itinerary}
          onChange={(e) => onFieldChange("itinerary", e.target.value)}
          placeholder="Describe the day-by-day itinerary..."
          rows={6}
          className="resize-none"
        />
        {errors.itinerary && <p className="text-destructive text-sm">{errors.itinerary}</p>}
      </div>

      {/* Images - File Upload */}
      <div className="space-y-2">
        <Label>Package Images * (1-10 images, max 5MB each)</Label>
        <p className="text-muted-foreground text-sm">
          Upload high-quality images (JPG, PNG, GIF, WebP)
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Drop zone */}
        {canAddMoreFiles && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">
              {imageFiles.length}/10 images uploaded
            </p>
          </div>
        )}

        {/* Image previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {imagePreviews.map((preview, index) => (
              <Card key={index} className="border-border overflow-hidden group relative">
                <CardContent className="p-0">
                  <div className="aspect-video relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => onFileRemove(index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 text-xs text-muted-foreground truncate">
                    {imageFiles[index]?.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No images placeholder */}
        {imagePreviews.length === 0 && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
            <ImageIcon className="h-4 w-4" />
            No images uploaded yet
          </div>
        )}

        {errors.images && <p className="text-destructive text-sm">{errors.images}</p>}
      </div>
    </div>
  );
}
