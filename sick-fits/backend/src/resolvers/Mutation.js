const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: { ...args },
      },
      info,
    );

    return item;
  },
  async updateItem(parent, args, ctx, info) {
    // Take a copy of the updates and remove the ID from the updates
    const { id, ...updates } = args;
    return await ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id,
      },
      info,
    });
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // Find item
    const item = await ctx.db.query.item({ where }, `{ id title}`);
    // TODO: check if they own that item

    // Delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // Lowercase their email
    args.email = args.email.toLowerCase();

    // Hash their password
    const password = await bcrypt.hash(args.password, 10);

    // Create user in DB
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info,
    );

    // Create the JWT token for the user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // We set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    // Return user to the browser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1. Check if there is an user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    // 3. generate the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // 4. Set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    // 5. return the user
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
};

module.exports = Mutations;
