const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
/* initiliaze method will take the user password and email
 * then check to see if the they exist
 */
function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async(emial,password,done) =>{
        const user = await getUserByEmail(email);
        if(user == null){
            return done(null, false, { message: "No user with that email"});
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null,user);
            }
            else{
                return done(null, false, {message: 'Password incorrect'})
            }
        }catch(err){
            return done(e)
        }
    };

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user,done) => done(null, user.id));
    passport.desirializeUser(async(id,done) => {
        return done(nulll, await getUserById(id))
    })
}