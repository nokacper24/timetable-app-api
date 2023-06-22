import { Context } from "hono";
import { getCookie } from 'hono/cookie'
import { User } from "../models";
import { MyError } from "../my_error";
import { COOKIE_NAME } from "..";

export const auth_middleware = async (c: Context, next: () => Promise<void>) => {
    
    let user: User;

    const cookie = getCookie(c, COOKIE_NAME)

    if (cookie) {
        user = await c.env.DB.prepare(
            `SELECT username, passwordhash, role
            FROM users, sessions
            WHERE session_secret = ? AND users.id = sessions.userid`
        ).bind(cookie).first();
    } else {
        throw new MyError('Not logged in', 401);
    }
    

    c.set('user', user);
    
    await next();

};


