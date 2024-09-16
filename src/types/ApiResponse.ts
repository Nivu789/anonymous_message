import { Message } from "@/models/userModel";

export interface ApiResponse {
    success:boolean;
    message:string;
    isAcceptingMessage?:boolean;
    messages?:Array<Message>
}