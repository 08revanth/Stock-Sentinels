const seedDatabase = async () => {
  try {
    const users = [
      { name: 'Rev', email: 'rev@example.com', password: 'password123' },
      { name: 'rah', email: 'rah@example.com', password: 'password123' },
    ];

    for (const user of users) {
      await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [user.name, user.email, user.password]);
    }

    const portfolios = [
      { userId: 1, stockSymbol: 'AAPL', quantity: 10 },
      { userId: 2, stockSymbol: 'GOOGL', quantity: 5 },
    ];

    for (const portfolio of portfolios) {
      await db.query('INSERT INTO portfolios (user_id, stock_symbol, quantity) VALUES (?, ?, ?)', [portfolio.userId, portfolio.stockSymbol, portfolio.quantity]);
    }

    const adminUser = { name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'admin' };
    await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [adminUser.name, adminUser.email, adminUser.password, adminUser.role]);

    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};
