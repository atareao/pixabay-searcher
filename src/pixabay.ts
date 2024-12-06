import GLib from "gi://GLib";
import Gio from "gi://Gio";
import Soup from "gi://Soup?version=3.0";

/*
 * Asynchronous programming with GJS
 * https://gjs.guide/guides/gjs/asynchronous-programming.html
 */
Gio._promisify(Soup.Session.prototype, "send_and_read_async",
               "send_and_read_finish");

Gio._promisify(Gio.File.prototype, "replace_contents_bytes_async",
               "replace_contents_finish");

export interface PixabayResponse {
    total: number;
    totalHits: number;
    hits: PixabayImage[];
}
export interface PixabayImage {
    id: number;
    pageURL: string;
    type: string;
    tags: string;
    previewURL: string;
    previewWidth: number;
    previewHeight: number;
    webformatURL: string;
    webformatWidth: number;
    webformatHeight: number;
    largeImageURL: string;
    fullHDURL: string;
    imageURL: string;
    imageWidth: number;
    imageHeight: number;
    imageSize: number;
    views: number;
    downloads: number;
    likes: number;
    comments: number;
    user_id: string;
    user: string;
    userImageURL: string;

}

export class Pixabay {
    private baseUrl = "htps://pixabay.com/api/";
    private _key: string | null = null;
    private _lang: string | null = null;

    constructor(key: string, lang: string){
        this._key = key;
        this._lang = lang;
    }

    async search(query: string, page: number, cancellable: Gio.Cancellable): Promise<PixabayResponse | null>{
        console.log("[PSI]", `Looking for: ${query}`);
        try{
            const session = new Soup.Session();
            const message = Soup.Message.new_from_encoded_form(
                'GET',
                this.baseUrl,
                Soup.form_encode_hash({
                    key: this._key,
                    lang: this._lang,
                    page: page.toString(),
                    per_page: "20",
                    q: query
                })
            );
            const bytes = await session.send_and_read_async(message,
                GLib.PRIORITY_DEFAULT, cancellable);
            if(bytes !== null){
                const response = (new TextDecoder())
                    .decode(bytes.get_data()?.buffer);
                const pixabayResponse: PixabayResponse = JSON.parse(response);
                return pixabayResponse;
            }
        }catch(e){
            console.error("[PSI]", "Error: ", e);
            throw new Error(`Error: ${e}`);
        }
        return null;
    }


    static async download(image: PixabayImage, cancellable: Gio.Cancellable): Promise<void>{
        console.log("[PSI]", `Downloading: ${image.tags}`);
        console.log("[PSI]", `Downloading: ${image.imageURL}`);
        console.log("[PSI]", `Downloading: ${image.id}`);
        try{
            const session = new Soup.Session();
            const message = Soup.Message.new_from_encoded_form(
                'GET',
                image.imageURL,
                Soup.form_encode_hash({
                })
            );
            const bytes = await session.send_and_read_async(message,
                GLib.PRIORITY_DEFAULT, cancellable);
            if(bytes !== null){
                const data = bytes.get_data() as Uint8Array;
                const extension = image.imageURL.split('.').pop();
                const file = Gio.File.new_for_path(`/tmp/${image.id}.${extension}`);
                console.log("[PSI]", `Saving to: ${file.get_path()}`);
                const response = await file.replace_contents_bytes_async(
                    data,
                    null,
                    false,
                    Gio.FileCreateFlags.REPLACE_DESTINATION,
                    null);
                console.log("[PSI]", "Response: ", response);
            }
        }catch(e){
            console.error("[PSI]", "Error: ", e);
            throw new Error(`Error: ${e}`);
        }
    }
}
