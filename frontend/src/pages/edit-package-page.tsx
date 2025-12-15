import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import MainLayout from "@/layout/main-layout";
import { useAuthStore } from "@/store/auth-store";
import { packageSchema } from "@/lib/validations";
import { PackageForm } from "@/components/package-form";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useFileArray } from "@/hooks/use-file-array";
import { useSEO } from "@/hooks/use-seo";
import * as packageService from "@/services/package.service";
import * as destinationService from "@/services/destination.service";
import type { Package, Destination } from "@/types";

export default function EditPackagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useSEO({
    title: "Edit Package",
    description: "Update your travel package details, pricing, and availability.",
    keywords: "edit package, update package, package management, agent tools",
  });

  // API data states
  const [isLoading, setIsLoading] = useState(true);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  // Track existing images from the server (as URLs)
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    destinationId: "",
    duration: "",
    price: "",
    itinerary: "",
    maxTravelers: "",
    contactPhone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validate } = useFormValidation(packageSchema);
  const { files: imageFiles, previews: imagePreviews, addFiles, removeFile, canAddMore } = useFileArray(10);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "agent") {
      navigate("/sign-in");
      return;
    }

    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const [packageData, destinationsData] = await Promise.all([
          packageService.getPackageById(id),
          destinationService.getAllDestinations(),
        ]);

        // Check permissions
        if (packageData.agentId !== user.id) {
          toast.error("You don't have permission to edit this package");
          navigate("/manage-packages");
          return;
        }

        setPkg(packageData);
        setDestinations(destinationsData);

        // Populate form
        setFormData({
          name: packageData.name,
          destinationId: packageData.destinationId,
          duration: packageData.duration.toString(),
          price: packageData.price.toString(),
          itinerary: packageData.itinerary,
          maxTravelers: packageData.maxTravelers.toString(),
          contactPhone: packageData.contactPhone || "",
        });

        // Store existing images from the package
        setExistingImages(packageData.images || []);
      } catch (error) {
        console.error("Failed to fetch package:", error);
        toast.error("Failed to load package");
        navigate("/manage-packages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate, id]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Need at least 1 image (existing or new)
    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages === 0) {
      toast.error("Please keep at least 1 image or upload new ones");
      return;
    }

    const dataToValidate = {
      ...formData,
      duration: Number(formData.duration),
      price: Number(formData.price),
      maxTravelers: Number(formData.maxTravelers),
      images: [...existingImages, ...imageFiles.map((f) => f.name)], // For validation only
    };

    if (!validate(dataToValidate)) return;

    setIsSubmitting(true);

    try {
      await packageService.updatePackage(id!, {
        name: dataToValidate.name,
        duration: dataToValidate.duration,
        price: dataToValidate.price,
        itinerary: dataToValidate.itinerary,
        maxTravelers: dataToValidate.maxTravelers,
        contactPhone: dataToValidate.contactPhone,
        images: existingImages, // Keep existing images (update API uses JSON, not FormData)
      });

      toast.success("Package updated successfully!");
      navigate("/manage-packages");
    } catch (error) {
      console.error("Failed to update package:", error);
      toast.error("Failed to update package");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading and not found states
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!pkg) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Card className="border-border p-8 text-center">
            <p className="text-muted-foreground">Package not found</p>
            <Button onClick={() => navigate("/manage-packages")} className="mt-4" variant="outline">
              Back to Packages
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-6 py-2 md:space-y-8 md:py-8 lg:py-12">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => navigate("/manage-packages")} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Packages
            </Button>
            <h1 className="text-foreground text-3xl font-bold md:text-4xl">Edit Package</h1>
            <p className="text-muted-foreground mt-2">Update your travel package information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Package Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PackageForm
                    formData={formData}
                    imageFiles={imageFiles}
                    imagePreviews={imagePreviews}
                    errors={errors}
                    destinations={destinations}
                    onFieldChange={handleFieldChange}
                    onFilesAdd={addFiles}
                    onFileRemove={removeFile}
                    canAddMoreFiles={canAddMore && (existingImages.length + imageFiles.length) < 10}
                  />

                  {/* Existing Images Section */}
                  {existingImages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Current Images</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {existingImages.map((img, index) => (
                          <Card key={index} className="border-border overflow-hidden group relative">
                            <CardContent className="p-0">
                              <div className="aspect-video relative">
                                <img
                                  src={img}
                                  alt={`Existing ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveExistingImage(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-border sticky top-8">
                <CardHeader>
                  <CardTitle>Update</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Package"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/manage-packages")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>

                  <div className="text-muted-foreground space-y-2 pt-4 text-sm">
                    <p>• All fields marked with * are required</p>
                    <p>• Changes will be saved immediately</p>
                    <p>• Existing bookings won't be affected</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </section>
    </MainLayout>
  );
}
