export interface ImageStore {
  save(file: File): Promise<string>;
  getBlob(ref: string): Promise<Blob | null>;
  remove(ref: string): Promise<void>;
}
