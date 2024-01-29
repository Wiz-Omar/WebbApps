// imageService.test.ts
import { ImageService } from "./imageService"

// Testing deletion of an image
test("If an image is deleted from the list then it should not be in the list", async () => {
    const id = 1;
    const imageService = new ImageService();
    await imageService.deleteImage(id);
    const images = await imageService.getImages();
    expect(images.some((image) => image.id === id)).toBeFalsy();
});

// Testing addition of an image
test("If an image is added to the list then it should be in the list", async () => {
    const filename = "test.png";
    const url = "http://example.com/test.jpg";
    const imageService = new ImageService();
    await imageService.addImage(filename, url);
    const images = await imageService.getImages();
    expect(images.some((image) => image.filename === filename && image.url === url)).toBeTruthy();
});

// Testing deletion of an image that does not exist
test("If an image is deleted from the list then it should not be in the list", async () => {
    const id = 1;
    const imageService = new ImageService();
    await imageService.deleteImage(id);
    const images = await imageService.getImages();
    expect(images.some((image) => image.id === id)).toBeFalsy();
});


// imageRouter.test.ts
import * as SuperTest from "supertest";
import { app } from "../../src/start";
import { Image } from "../model/image";

const request = SuperTest.default(app);

test("End-to-end test", async () => {
    // upload an image
    const res0 = await request.post("/").send({ filename: "test.png", url: "http://example.com/test.jpg" });
    expect(res0.statusCode).toEqual(201);
    // get all images (only one image)
    const res1 = await request.get("/");
    // should be 200 OK
    expect(res1.statusCode).toEqual(200);
    // get the ID of the image
    const id = res1.body[0].id;
    // delete the image
    const res2 = await request.delete(`/${id}`);
    // should be 200 OK
    expect(res2.statusCode).toEqual(200);
    // get all images (no images)
    const res3 = await request.get("/");
    // should be 200 OK
    expect(res3.statusCode).toEqual(200);
    // should not contain the deleted image
    expect(res3.body.map((image : Image) => image.id)).not.toContain(id);
});