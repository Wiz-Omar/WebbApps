import { Session } from "express-session";
import { sessionData } from "../router/userRequests";
import express, { Request } from "express";

export interface GetImagesRequest extends Request {
  params: {};
  session: Session & Partial<sessionData>;
  query: {
    sortField?: string;
    sortOrder?: string;
    onlyLiked?: string;
  };
}

export interface PostImageRequest extends Request {
  params: {};
  session: Session & Partial<sessionData>;
  body: { filename: string; url: string };
}

export interface DeleteImageRequest extends Request {
  params: { imageId: string };
  session: Session & Partial<sessionData>;
  body: {};
}

export interface SearchImageRequest extends Request {
  params: {};
  session: Session & Partial<sessionData>;
  query: {
    search: string;
  };
}

export interface PatchImageRequest extends Request {
  params: { imageId: string };
  session: Session & Partial<sessionData>;
  body: { newFilename: string };
}
