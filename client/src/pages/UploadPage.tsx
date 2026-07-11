import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Crop, Download, FileImage, UploadCloud } from "lucide-react";
import { api } from "../api/http";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { Input } from "../components/ui/Input";
import handwritingTemplateUrl from "../assets/handwriting-template.svg?url";

async function cropImage(imageSrc: string, area: Area, filename: string): Promise<File> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not crop image");
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("Could not export crop"))), "image/jpeg", 0.92);
  });
  return new File([blob], filename.replace(/\.[^.]+$/, "-cropped.jpg"), { type: "image/jpeg" });
}

export function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fontName, setFontName] = useState("My FontSmith");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((accepted: File[]) => {
    const selected = accepted[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    maxFiles: 1
  });

  async function upload() {
    if (!file) return;
    setUploading(true);
    setProgress(12);
    try {
      const uploadFile = preview && croppedArea ? await cropImage(preview, croppedArea, file.name) : file;
      setProgress(45);
      const result = await api.upload(uploadFile);
      setProgress(100);
      navigate("/processing", { state: { uploadId: result.uploadId, fontName } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Upload handwriting</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">Create a new font</h1>
        <p className="mt-3 text-ink/65 dark:text-paper/65">Drag in a PNG, JPG, or JPEG handwriting template and crop it before processing.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <GlassCard className="p-6">
          <Input label="Font name" value={fontName} onChange={(event) => setFontName(event.target.value)} />
          <div className="mt-5 rounded-lg border border-sea/20 bg-sea/10 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-extrabold">Handwriting template</h2>
                <p className="mt-1 text-sm leading-6 text-ink/60 dark:text-paper/60">
                  Download the sheet, write each character, then upload a photo or scan.
                </p>
              </div>
              <a href={handwritingTemplateUrl} download="fontsmith-handwriting-template.svg">
                <Button variant="secondary" className="w-full whitespace-nowrap sm:w-auto">
                  <Download className="h-4 w-4" /> Template
                </Button>
              </a>
            </div>
          </div>
          <div
            {...getRootProps()}
            className={`mt-5 grid min-h-[280px] cursor-pointer place-items-center rounded-lg border-2 border-dashed p-8 text-center transition ${
              isDragActive ? "border-sea bg-sea/10" : "border-ink/15 bg-white/45 dark:border-white/15 dark:bg-white/5"
            }`}
          >
            <input {...getInputProps()} />
            <div>
              <UploadCloud className="mx-auto h-12 w-12 text-sea" />
              <h2 className="mt-4 text-xl font-extrabold">Drag and drop handwriting here</h2>
              <p className="mt-2 text-sm text-ink/55 dark:text-paper/55">or click to choose PNG, JPG, or JPEG</p>
            </div>
          </div>

          {uploading ? (
            <div className="mt-5">
              <div className="h-3 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-sea to-coral transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm font-bold text-sea">{progress}% uploaded</p>
            </div>
          ) : null}

          <Button onClick={upload} disabled={!file} loading={uploading} className="mt-5 w-full">
            <FileImage className="h-4 w-4" /> Upload and process
          </Button>
        </GlassCard>

        <GlassCard className="overflow-hidden p-0">
          <div className="flex items-center gap-3 border-b border-ink/10 p-4 dark:border-white/10">
            <Crop className="h-5 w-5 text-coral" />
            <h2 className="font-extrabold">Crop preview</h2>
          </div>
          {preview ? (
            <>
              <div className="relative h-[420px] bg-ink">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, area) => setCroppedArea(area)}
                />
              </div>
              <div className="p-5">
                <label className="text-sm font-bold">
                  Zoom
                  <input className="mt-3 w-full accent-sea" min={1} max={3} step={0.1} type="range" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
                </label>
              </div>
            </>
          ) : (
            <div className="grid min-h-[420px] place-items-center p-8 text-center text-ink/55 dark:text-paper/55">
              Image preview and crop controls appear after upload.
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
