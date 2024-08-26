// schema-validator.js
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs/promises';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

async function validateSchema(schemaPath) {
  try {
    const schemaContent = await fs.readFile(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);

    // Validate the schema itself
    const validateSchema = ajv.compile(schema);
    
    if (validateSchema.errors) {
      console.error('Invalid JSON Schema:');
      console.error(ajv.errorsText(validateSchema.errors));
    } else {
      console.log('JSON Schema is valid.');
    }

    return validateSchema;
  } catch (error) {
    console.error('Error reading or parsing schema file:', error.message);
    return null;
  }
}

async function validateData(dataPath, validateFunction) {
  try {
    const dataContent = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(dataContent);

    const valid = validateFunction(data);

    if (valid) {
      console.log('Data is valid according to the schema.');
    } else {
      console.error('Invalid data:');
      console.error(ajv.errorsText(validateFunction.errors));
    }
  } catch (error) {
    console.error('Error reading or parsing data file:', error.message);
  }
}

async function main() {
  const schemaPath = './schema.json';
  const validDataPath = './valid-data.json';
  const invalidDataPath = './invalid-data.json';

  const validateFunction = await validateSchema(schemaPath);
  
  if (validateFunction) {
    console.log('\nValidating valid data:');
    await validateData(validDataPath, validateFunction);

    console.log('\nValidating invalid data:');
    await validateData(invalidDataPath, validateFunction);
  }
}

main().catch(console.error);

