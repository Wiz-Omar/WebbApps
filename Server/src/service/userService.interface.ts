import { User } from "../model/user";

/**
 * Interface for the user service.
 * It is responsible for adding, getting and deleting users from the database. Can also check if a user exists.
 */
export interface IUserService {

    /**
     * Checks if a user exists in the database.
     * @param username The username of the user to check. Type: string
     * @param password The password of the user to check. Type: string
     * @returns {Promise<Boolean>} A promise that resolves to a boolean indicating if the user exists.
     */
    find(username: string, password: string): Promise<boolean>;

    /**
     * Adds a new user to the database.
     * @param username The username of the user to add. Type: string
     * @param password The password of the user to add. Type: string
     */
    addUser(username: string, password: string): Promise<void>;

    /**
     * Removes a user from the database.
     * @param username The username of the user to remove. Type: string
     */
    removeUser(username: string): Promise<void>;

    /**
     * Retrieves a user by their username.
     * @param username The username of the user to retrieve.
     * @returns A promise that resolves to a User object.
     */
    getUser(username: string): Promise<User>;
}