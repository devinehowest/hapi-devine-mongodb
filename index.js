const path = require(`path`);

const glob = require(`glob`);
const chalk = require(`chalk`);

const mongoose = require(`mongoose`);
mongoose.Promise = global.Promise;

module.exports.register = (server, options, next) => {

  const {
    schemasDir,
    mongoUrl,
    log = true
  } = options;

  if (!mongoUrl || !schemasDir) {
    throw new Error(`'mongoUrl' and 'schemasDir' required`);
  }

  mongoose.connect(mongoUrl);

  glob(

    path.join(schemasDir, `**/*.js`),
    {ignore: [`**/*/index.js`, `**/*/_*.js`]},

    (err, files) => files.forEach(f => {

      const file = path.resolve(schemasDir, f);
      const {schema, collectionName, modelName = path.basename(f, `.js`)} = require(file);

      const model = mongoose.model(modelName, schema, collectionName);
      const {collectionName: cn} = model.collection;

      if (log) console.log(
        `${chalk.yellow(`mongoose`)}: registered schema ${chalk.cyan(`'${modelName}'`)}, collection: ${chalk.cyan(`'${cn}'`)}`
      );

    })

  );

  next();

};

exports.register.attributes = {
  pkg: require(`./package.json`)
};
