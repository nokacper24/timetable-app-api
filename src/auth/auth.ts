import { Context } from "hono";
import { User } from "..";
import { getCookie } from 'hono/cookie'

export const auth_middleware = async (c: Context, next: () => Promise<void>) => {
    
    let user: User;

    const cookie = getCookie(c, 'session')

    if (cookie) {
        user = await c.env.DB.prepare(
            "SELECT * FROM users WHERE session_secret = ?"
        ).first(cookie);
    } else {
        throw new Error('Not logged in');
    }
    

    c.set('user', user);
    
    await next();

};