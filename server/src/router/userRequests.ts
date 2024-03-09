import session, { Session } from "express-session";
import { Request } from "express";

export interface sessionData {
  username: string;
}
export interface registerRequest extends Request {
  body: { username: string; password: string };
}
export interface loginRequest extends Request {
  params: {};
  session: Session & Partial<sessionData>;
  body: { username: string; password: string };
}
export interface deleteRequest extends Request {
  params: {};
  session: Session & Partial<sessionData>;
}

