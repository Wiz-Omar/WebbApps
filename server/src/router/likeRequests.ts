import { Session } from "express-session";
import { Request } from "express";
import { sessionData } from "./userRouter";

/* interface ImageFetchRequest extends Request{
    params: {},
    session: Session & Partial<sessionData>,
    body: {
        imageId: string, //TODO: should this be a number or is it correct to parse the recieved string?
    }
} */
export interface ImageLikeRequest extends Request {
    body: {};
    session: Session & Partial<sessionData>;
    params: {
      imageId: string;
    };
  }
  
 export interface AllLikedImagesRequest extends Request {
    params: {};
    session: Session & Partial<sessionData>;
    body: {};
  }