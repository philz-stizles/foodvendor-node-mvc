const AppError = require('../errors/app.error');
const { verifyToken } = require('../services/security/jwt.services');

exports.isAuthenticated = async (req, res, next) => {
    try {
        // Check if token exists.
        let token = '';
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            // eslint-disable-next-line prefer-destructuring
            token = req.cookies.token;
        }

        if (!token)
            return next(new AppError(401, 'You are not logged in. Please log'));

        // Check if token is valid
        const decodedToken = await verifyToken(token);
        if (!decodedToken)
            return next(
                new AppError(401, 'You are not authorized. Please sign up'),
            );
        console.log(decodedToken);
        // Check if user exists(or if a previously existing user with a valid token has been deleted)
        // and return user if true
        const dbConnect = dbo.getDb();
        const users = dbConnect.collection('users');

        console.log(typeof decodedToken.id);

        // Retrieve user if user exists.
        const existingUser = await users.findOne({
            _id: new ObjectId(decodedToken.id),
        });
        if (!existingUser)
            return next(
                new AppError(
                    401,
                    'You no longer have access to this resource. Please sign up',
                ),
            );

        // Check if user changed password after JWT was created passing the issued at(iat) value
        // const passwordChangedAfterTokenGen =
        //   existingUser.isPasswordChangedAfterTokenGen(decodedToken.iat)
        // if (passwordChangedAfterTokenGen)
        //   return next(
        //     new AppError(
        //       401,
        //       'User recently changed their password! Please log in again.',
        //     )
        //   )

        // Grant access to protected routes.
        req.user = existingUser;
        // res.locals.user = existingUser; // For view
        // res.locals.isAuthenticated = true; // For view

        return next();
    } catch (error) {
        return next(
            new AppError(
                500,
                'You cannot access this resource at the moment. Please try again later',
            ),
        );
    }
};

exports.isAuthorized = (...authorizedRoles) => async (req, res, next) => {
    if (req.user.roles.some((role) => authorizedRoles.includes(role))) {
        return next(
            new AppError(
                403,
                'You do not have the permission to perform this action',
            ),
        );
    }

    return next();
};

// exports.isOwner = async (req, res, next) => {
//     if (req.user) {
//     }

//     return next();
// };
