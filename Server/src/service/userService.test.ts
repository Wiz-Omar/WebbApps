import { UserService } from "./userService";
import { IUserService } from "./userService.interface";

jest.mock("../db/conn")

test("If a user is added then it should be found", async () => {
    const userService: IUserService = new UserService();

    await userService.addUser("testUser", "12345678");
    const isUserFound: Boolean = await userService.find("testUser", "12345678");

    expect(isUserFound).toBe(true);

    //reset database values
    await userService.removeUser('testUser');
});

test("Adding a user with the same username throws an UserExistsError", async () => {
    const userService: IUserService = new UserService();

    await userService.addUser("testUser", "12345678");
    try{
        await userService.addUser("testUser", "123456789");
        fail();
    }catch(e: any){
        expect(e.name).toBe("UserExistsError");
    }

    //reset database values
    await userService.removeUser('testUser');
});

test("If a user is removed, then they should not be found", async() => {
    const userService: IUserService = new UserService();

    await userService.addUser("testUser", "12345678");
    await userService.removeUser('testUser');
    const isUserFound: Boolean = await userService.find("testUser", "12345678");
    expect(isUserFound).toBe(false);
});

test("Removing a non-existent user throws an error", async () => {
    const userService: IUserService = new UserService();
    try{
        await userService.removeUser('testUser');
        fail();
    }catch(e: any){
        expect(e.name).toBe("UserNotFoundError");
    }
});