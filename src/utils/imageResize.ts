/**
 * 이미지 리사이징 유틸리티
 * 클라이언트 사이드에서 이미지를 리사이징하여 파일 크기를 줄입니다.
 */

export interface ResizeOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
}

/**
 * 이미지 파일을 리사이징합니다.
 * @param file 원본 이미지 파일
 * @param options 리사이징 옵션
 * @returns 리사이징된 이미지 Blob
 */
export async function resizeImage(
    file: File,
    options: ResizeOptions = {}
): Promise<Blob> {
    const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.85,
        outputFormat = 'image/jpeg'
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // 원본 크기
                let width = img.width;
                let height = img.height;

                // 리사이징이 필요한지 확인
                if (width <= maxWidth && height <= maxHeight) {
                    // 리사이징 불필요, 원본 반환
                    resolve(file);
                    return;
                }

                // 비율 유지하며 리사이징
                const aspectRatio = width / height;

                if (width > maxWidth) {
                    width = maxWidth;
                    height = width / aspectRatio;
                }

                if (height > maxHeight) {
                    height = maxHeight;
                    width = height * aspectRatio;
                }

                // Canvas를 사용해 리사이징
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context를 가져올 수 없습니다.'));
                    return;
                }

                // 이미지 그리기
                ctx.drawImage(img, 0, 0, width, height);

                // Blob으로 변환
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('이미지 변환에 실패했습니다.'));
                        }
                    },
                    outputFormat,
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('이미지 로드에 실패했습니다.'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('파일 읽기에 실패했습니다.'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * 이미지 파일을 리사이징하고 Data URL로 반환합니다.
 * @param file 원본 이미지 파일
 * @param options 리사이징 옵션
 * @returns 리사이징된 이미지 Data URL
 */
export async function resizeImageToDataURL(
    file: File,
    options: ResizeOptions = {}
): Promise<string> {
    const blob = await resizeImage(file, options);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string);
        };

        reader.onerror = () => {
            reject(new Error('파일 읽기에 실패했습니다.'));
        };

        reader.readAsDataURL(blob);
    });
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
 * @param bytes 바이트 크기
 * @returns 포맷된 문자열 (예: "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
