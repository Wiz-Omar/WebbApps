// imageService.test.ts
import { ImageService } from "./imageService";
import { IImageService } from "./imageService.interface";
import { LikeService } from "./likeService";
import { UserService } from "./userService";
import { IUserService } from "./userService.interface";
import { Image } from '../model/image';
import { ILikeService } from "./likeService.interface";
import { Sorting } from "../model/sorting";

jest.mock("../db/conn")

// Testing deletion of an image. Sometimes fails for no reason
test("If an image is added and deleted from the list then it should not be in the list", async () => {
    const imageService: IImageService = new ImageService();
    const userService: IUserService = new UserService();

    await userService.addUser("testUser", "12345678");
    const image: Image = await imageService.addImage('testImage', 'http://test.com', 'testUser'); // Add a mock image for the user 'testUser'.
    let images: Image[] = (await imageService.getImages(undefined, 'testUser', false));
    expect(images.length === 1).toBe(true);
    await imageService.deleteImage(image.id, 'testUser');
    images = await imageService.getImages(undefined, 'testUser', false);
    expect(images.some((randomImage) => randomImage.id === image.id)).toBeFalsy();
    expect(images.length === 0).toBe(true);

    //reset database values
    await userService.removeUser('testUser');
});

test("If two images is added and one is deleted from the list then the correct one should be in the list", async () => {
    const imageService: IImageService = new ImageService();
    const userService: IUserService = new UserService();

    await userService.addUser("testUser", "12345678");
    const image1: Image = await imageService.addImage('testImage1', 'http://test1.com', 'testUser'); // Add a mock image for the user 'testUser'.
    const image2: Image = await imageService.addImage('testImage2', 'http://test2.com', 'testUser'); // Add a mock image for the user 'testUser'.
    let images: Image[] = (await imageService.getImages(undefined, 'testUser', false));
    expect(images.length === 2).toBe(true);
    await imageService.deleteImage(image1.id, 'testUser');
    images = await imageService.getImages(undefined, 'testUser', false);
    expect(images.some((randomImage) => randomImage.id === image1.id)).toBeFalsy();
    expect(images.some((randomImage) => randomImage.id === image2.id)).toBeTruthy();
    expect(images.length === 1).toBe(true);

    //reset database values
    await imageService.deleteImage(image2.id, 'testUser');
    await userService.removeUser('testUser');
});

test("If a liked image is removed, it should be removed from the liked images array aswell", async() => {
    const likeService: ILikeService = new LikeService();
    const imageService: IImageService = new ImageService();
    const userService: IUserService = new UserService();

    await userService.addUser("testUser", "12345678");
    //Create image
    const image = await imageService.addImage('testImage1', 'http://test1.com', 'testUser');
    const imageId = image.id;
    expect(await likeService.isImageLiked(imageId.toString(),'testUser')).toBe(false);

    //Like image, assuming liking works as intended
    await likeService.likeImage(imageId.toString(),'testUser');
    expect(await likeService.isImageLiked(imageId.toString(),'testUser')).toBe(true);

    //Delete image
    await imageService.deleteImage(imageId, 'testUser');
    const images = await imageService.getImages(undefined, 'testUser', false);

    //Image should not be in images list
    expect(images.some((image) => image.id === imageId)).toBeFalsy();

    //Image should not be in liked images list
    expect(await likeService.getLikedImages('testUser')).toStrictEqual([]);

    //reset database values
    await userService.removeUser('testUser');
});

// Testing sorting of images, filename ascending
test("Images should be sorted by filename in ascending order", async () => {
    const imageService: IImageService = new ImageService();
    const userService: IUserService = new UserService();

    await userService.addUser("testUser", "12345678");
    // Use enums for sortField and sortOrder
    const image1: Image = await imageService.addImage('testImage2', 'http://test1.com', 'testUser'); // Add a mock image for the user 'testUser'.
    const image2: Image = await imageService.addImage('testImage1', 'http://test2.com', 'testUser'); // Add a mock image for the user 'testUser'.
    const sorting: Sorting = { sortField: 'filename', sortOrder: 'asc' };
    const images: Image[] = (await imageService.getImages(sorting, 'testUser', false));
    const filenames = images.map((image) => image.filename);
    const sortedFilenames = [...filenames].sort((a, b) => a.localeCompare(b)); // Explicit sorting for clarity
    expect(filenames).toEqual(sortedFilenames);

    //reset database values
    await imageService.deleteImage(image1.id, 'testUser');
    await imageService.deleteImage(image2.id, 'testUser');
    await userService.removeUser('testUser');
});

// Testing sorting of images, filename descending
test("Images should be sorted by filename in descending order", async () => {
    const imageService: IImageService = new ImageService();
    const userService: IUserService = new UserService();

    await userService.addUser("testUser", "12345678");
    const image1: Image = await imageService.addImage('testImage1b', 'http://test1.com', 'testUser'); // Add a mock image for the user 'testUser'.
    const image2: Image = await imageService.addImage('testImage2a', 'http://test2.com', 'testUser'); // Add a mock image for the user 'testUser'.
    // Use enums for sortField and sortOrder
    const sorting: Sorting = { sortField: 'filename', sortOrder: 'desc' };
    const images: Image[] = (await imageService.getImages(sorting, 'testUser', false));
    const filenames = images.map((image) => image.filename);
    const sortedFilenames = [...filenames].sort((a, b) => b.localeCompare(a)); // Sort and then reverse for descending
    expect(filenames).toEqual(sortedFilenames);

    //reset database values
    await imageService.deleteImage(image1.id, 'testUser');
    await imageService.deleteImage(image2.id, 'testUser');
    await userService.removeUser('testUser');
});