const createDatabase = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`;

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.Users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(70) NOT NULL,
        password VARCHAR(255) NULL,
        avatar VARCHAR(255) NULL,
        isActive BOOL,
        lastSeen DATETIME NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
`;

const createMenusTable = `
    CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.Menus (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(70) NOT NULL,
        description VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255) NULL,
        creator INT(11),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (creator) REFERENCES Users(id)
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
`;

const createIngredientsTable = `
    CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.Menus (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        quantity INT(11),
        menu INT(11),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (menu) REFERENCES Menus(id)
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
`;

const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.Categories (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255) NULL,
        creator INT(11),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (creator) REFERENCES Users(id)
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
`;

const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.Orders (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255) NULL,
        creator INT(11),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (creator) REFERENCES Users(id)
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
`;

const createOrderMenusTable = `
    CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.OrderMenus (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255) NULL,
        creator INT(11),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (creator) REFERENCES Users(id)
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
`;

const createCouponsTable = `
    CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.Coupons (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255) NULL,
        creator INT(11),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (creator) REFERENCES Users(id)
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
`;

const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.Transactions (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255) NULL,
        creator INT(11),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (creator) REFERENCES Users(id)
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
`;

module.exports = `
    ${createDatabase}
    ${createUsersTable}
    ${createMenusTable}
    ${createIngredientsTable}
    ${createCategoriesTable}
    ${createCouponsTable}
    ${createTransactionsTable}
    ${createOrdersTable}
    ${createOrderMenusTable}
`;