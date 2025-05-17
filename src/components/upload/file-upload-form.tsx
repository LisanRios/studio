"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Assuming useToast is available

export function FileUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setUploadStatus("idle");
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF file.",
          variant: "destructive",
        });
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/error
    const success = Math.random() > 0.3; // 70% chance of success
    if (success) {
      setUploadStatus("success");
      toast({
        title: "Upload Successful",
        description: `${selectedFile.name} has been uploaded.`,
      });
      setSelectedFile(null); // Clear file input after successful upload
      // Reset file input visually
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } else {
      setUploadStatus("error");
      toast({
        title: "Upload Failed",
        description: `Could not upload ${selectedFile.name}. Please try again.`,
        variant: "destructive",
      });
    }
    setIsUploading(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center text-primary mb-2">
            <UploadCloud className="w-8 h-8 mr-3" />
            <CardTitle className="text-3xl">Upload Album PDF</CardTitle>
        </div>
        <CardDescription>
          Select a PDF file of a soccer album to add it to the archive.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="pdf-upload" className="text-lg font-medium mb-2 block">
              Choose PDF File
            </Label>
            <Input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>

          {selectedFile && (
            <div className="p-4 border rounded-md bg-secondary/50 flex items-center space-x-3">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="flex items-center text-green-600 p-3 bg-green-50 rounded-md">
              <CheckCircle className="w-5 h-5 mr-2" />
              <p>File uploaded successfully!</p>
            </div>
          )}
          {uploadStatus === "error" && (
            <div className="flex items-center text-red-600 p-3 bg-red-50 rounded-md">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>Upload failed. Please try again.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!selectedFile || isUploading}>
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5 mr-2" /> Upload PDF
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
