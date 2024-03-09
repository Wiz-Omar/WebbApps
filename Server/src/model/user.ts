/**
 * User model
 * 
 * Represents a user in the system.
 * 
 * @param {string} id The unique identifier for the user
 * @param {string} username The username of the user
 * @param {string} password The password of the user
 */
export interface User {
    id: string;
    username: string;
    password: string;
}