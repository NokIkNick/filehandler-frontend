import { NgxFileDropEntry } from "ngx-file-drop";

export interface FileProgress {
    file: NgxFileDropEntry,
    progress: number,
    status: string;
}
