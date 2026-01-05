import ImageUploading, { type ImageListType } from "react-images-uploading";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import "./PhotoUploader.css";
import { IoClose } from "react-icons/io5";
import Spacer from "@components/Spacer/Spacer";
import { FaFileImage } from "react-icons/fa";

interface PhotoUploaderProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  maxFiles?: number;
  minFiles?: number;
}

export function PhotoUploader<T extends FieldValues>({
  name,
  control,
  maxFiles = 10,
  minFiles = 1,
}: PhotoUploaderProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (files: File[]) => {
          if (!files || files.length < minFiles) {
            return `Please upload at least ${minFiles} image${
              minFiles > 1 ? "s" : ""
            }`;
          }
          if (files.length > maxFiles) {
            return `You can upload max ${maxFiles} images`;
          }
          return true;
        },
      }}
      defaultValue={[] as any}
      render={({ field, fieldState }) => {
        const onChange = (imageList: ImageListType) => {
          field.onChange(imageList.map((img) => img.file));
        };

        const images = (field.value as File[])?.map((file) => ({
          file,
          dataURL: URL.createObjectURL(file),
        }));

        return (
          <div className="pu-wrapper">
            <label className="pu-label">Photos</label>
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxFiles}
              acceptType={["jpg", "jpeg", "png", "webp"]}
              dataURLKey="dataURL"
            >
              {({ imageList, onImageUpload, onImageRemove, dragProps, isDragging, errors }) => (
                <div>
                  {/* Drag & Drop area */}
                  <div
                    className={`pu-dropzone ${
                      isDragging ? "pu-dropzone-dragging" : ""
                    }`}
                    {...dragProps}
                    onClick={onImageUpload}
                  >
                    <FaFileImage size={28} aria-hidden={true} focusable={false} />
                    Click or Drop images here
                  </div>

                  <Spacer size={8} />

                  {/* Previews */}
                  <div className="pu-preview-list">
                    {imageList.map((image, index) => (
                      <div key={index} className="pu-preview-item">
                        <img
                          src={image.dataURL}
                          alt={`Uploaded image ${index + 1}`}
                          className="pu-preview-img"
                        />
                        <div className="pu-buttons">
                          <button
                            className="pu-remove-button"
                            type="button"
                            onClick={() => onImageRemove(index)}
                            aria-label={`Remove uploaded image ${index + 1}`}
                          >
                            <IoClose className="pu-remove-button-icon" size={28} aria-hidden={true} focusable={false} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Validation error */}
                  {errors && <div className="pu-error">
                    {errors.maxNumber && <span>Number of selected images exceed maxNumber</span>}
                    {errors.acceptType && <span>Your selected file type is not allowed</span>}
                    {errors.maxFileSize && <span>Selected file size exceed maxFileSize</span>}
                    {errors.resolution && <span>Selected file is not match your desired resolution</span>}
                  </div>}

                  {fieldState.error && (
                    <p className="pu-error">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            </ImageUploading>
          </div>
        );
      }}
    />
  );
}
