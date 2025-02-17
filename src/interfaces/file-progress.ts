import { NgxFileDropEntry } from "ngx-file-drop";

export interface FileProgress {
    file: NgxFileDropEntry,
    fileName: string,
    progress: number,
    status: string;
}
