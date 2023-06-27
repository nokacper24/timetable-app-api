import { Context, Hono } from "hono";
import { getCookie, setCookie } from 'hono/cookie'
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

type ContextLoggedIn = {
    Bindings: {
      DB: D1Database;
    };
    Variables: {
      user: User;
    };
  };

export const priv = new Hono<ContextLoggedIn>();
// priv.use('*', auth_middleware);



priv.get('/me', auth_middleware, async (c) => {
    const user = c.get('user');
    return c.json(user);
  });

priv.get('/setcookie', async (c) => {
  setCookie(c, COOKIE_NAME, 'sessionid');
  return c.json({ message: 'cookie set' });
});