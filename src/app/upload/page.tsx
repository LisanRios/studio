import { FileUploadForm } from "@/components/upload/file-upload-form";

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Upload New Album PDF</h1>
        <p className="text-lg text-muted-foreground">
          Contribute to the archive by uploading PDF versions of soccer albums.
        </p>
      </header>
      <FileUploadForm />
    </div>
  );
}
