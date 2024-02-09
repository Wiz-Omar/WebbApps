import { Image } from "../model/image";
import { validSortFields, validSortOrders } from "../model/sorting";

export class ImageService {
    //private images: Image[] = [];
    // create a temporary array with image(s) to test the app
    private images: Image[] = [
        {
            id: Date.now() + 1,
            filename: "a.png",
            url: "https://images.unsplash.com/photo-1707306984355-4388b7ad51f1?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            uploadDate: new Date()
        },
        {
            id: Date.now() + 2,
            filename: "b.png",
            url: "https://images.unsplash.com/photo-1571077597806-78f29c02b6f2?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            uploadDate: new Date()
        },
        {
            id: Date.now() + 3,
            filename: "c.png",
            url: "https://images.unsplash.com/photo-1706856377207-b5d0a96e4c3b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            uploadDate: new Date()
        },
        {
            id: Date.now() + 4,
            filename: "d.png",
            url: "https://images.unsplash.com/photo-1682686580922-2e594f8bdaa7?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            uploadDate: new Date()
        },
        {
            id: Date.now() + 5,
            filename: "e.png",
            url: "https://images.unsplash.com/photo-1705550557298-42785f97f447?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            uploadDate: new Date()
        },
        {
            id: Date.now() + 6,
            filename: "f.png",
            url: "https://images.unsplash.com/photo-1707305318447-a40cc038dd7b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            uploadDate: new Date()
        }
        
    ];

    async addImage(filename: string, url: string): Promise<Image> {
        const image: Image = {
            id: Date.now(), // Simple ID generation
            filename: filename,
            url: url,
            uploadDate: new Date()
        };
        this.images.push(image);
        return { ...image };
    }

    async getImages(sortField: string = 'filename', sortOrder: string = 'asc'): Promise<Image[]> {

        // Validate sortField and sortOrder
        if (!validSortFields.includes(sortField)) {
            throw new Error(`Invalid sort field. Valid options are ${validSortFields.join(', ')}.`);
        }
        if (!validSortOrders.includes(sortOrder)) {
            throw new Error(`Invalid sort order. Valid options are ${validSortOrders.join(', ')}.`);
        }

        this.images.sort((a, b) => {
            //TODO: is this type safe enough?
            let valueA = a[sortField as keyof Image];
            let valueB = b[sortField as keyof Image];

            // Assuming all fields you want to sort by are either strings or can be compared directly
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else {
                // Handle other types as needed, assuming they are comparable like dates or numbers
                if (sortOrder === 'asc') {
                    return valueA < valueB ? -1 : 1;
                } else {
                    return valueA > valueB ? -1 : 1;
                }
            }
        });

        // Deep copy to avoid mutating the original array
        return JSON.parse(JSON.stringify(this.images));
    }
    

    async deleteImage(id: number): Promise<boolean> {
        const index = this.images.findIndex(image => image.id === id);
        if (index === -1) {
            return false; // Image not found
        }
        this.images.splice(index, 1);
        return true; // Deletion successful
    }    
}
