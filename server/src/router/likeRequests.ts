import { Session } from "express-session";
import { Request } from "express";
import { sessionData } from "../router/userRequests";

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