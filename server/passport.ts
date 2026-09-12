import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { Auth } from './db/api';
import type { UserInstance } from './db/types';

const checkPassword = (user: UserInstance, password: string): Promise<UserInstance> => {
    return bcrypt.compare(password, user.password).then(isEqual => {
        if (isEqual) {
            return user;
        } else {
            return Promise.reject(new Error('Password is invalid'));
        }
    });
};

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) =>
    Auth.findById(Number(id))
        .then(user => done(null, user ?? undefined))
        .catch(error => done(error, undefined)),
);

passport.use(new LocalStrategy(
    function (username, password, done) {
        Auth.findByUsername(username)
            .then(user => {
                if (user) {
                    return checkPassword(user, password)
                        .then(user => done(null, user))
                        .catch(error => done(null, false, error.message));
                } else {
                    return done(null, false, { message: 'Username is incorrect' });
                }
            })
            .catch(error => done(null, false, error.message));
    },
));

const authRedirects = {
    successRedirect: '/lobby',
    failureRedirect: '/',
};

export { passport, authRedirects };
export const authenticate = passport.authenticate('local', authRedirects);