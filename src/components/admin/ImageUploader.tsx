'use client';

import { useState, useCallback } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '@/lib/firebase';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    productId?: string; // Optional: used for folder structure
}

export default function ImageUploader({ images, onChange, productId }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (files: FileList) => {
        setUploading(true);
        setProgress(0);
        const storage = getStorage(app);
        const newImages: string[] = [...images];
        const totalFiles = files.length;
        let completedFiles = 0;

        // Use a temporary ID if productId is not provided (e.g. creating new product)
        const folderId = productId || 'temp-' + Date.now();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Basic validation
            if (!file.type.startsWith('image/')) continue;
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert(`File ${file.name} is too large (max 5MB)`);
                continue;
            }

            const storageRef = ref(storage, `products/${folderId}/${Date.now()}-${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            await new Promise<void>((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // Calculate overall progress roughly
                        setProgress(((completedFiles + (p / 100)) / totalFiles) * 100);
                    },
                    (error) => {
                        console.error(error);
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        newImages.push(downloadURL);
                        completedFiles++;
                        resolve();
                    }
                );
            });
        }

        onChange(newImages);
        setUploading(false);
        setProgress(0);
    };

    const removeImage = async (indexToRemove: number) => {
        const imageToDelete = images[indexToRemove];
        const newImages = images.filter((_, index) => index !== indexToRemove);
        onChange(newImages);

        // Optional: Delete from storage
        // Note: In a real app, you might want to only delete from storage when the user saves the form,
        // or have a cleanup process. For now, we'll just remove from the list.
        // If we wanted to delete immediately:
        /*
        try {
          const storage = getStorage(app);
          const imageRef = ref(storage, imageToDelete);
          await deleteObject(imageRef);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
        */
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />

                <div className="space-y-2 pointer-events-none">
                    <div className="text-4xl">📷</div>
                    <p className="text-white font-medium">
                        {uploading ? 'جاري الرفع...' : 'اسحب الصور هنا أو اضغط للاختيار'}
                    </p>
                    <p className="text-neutral-500 text-sm">
                        PNG, JPG, WEBP (Max 5MB)
                    </p>
                </div>

                {uploading && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-800 rounded-b-xl overflow-hidden">
                        <div
                            className="h-full bg-red-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="group relative aspect-square bg-neutral-900 rounded-xl border border-white/10 overflow-hidden">
                            <img
                                src={url}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    type="button"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
