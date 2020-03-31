import Ajv from 'ajv';
import { schema } from './schema'
import config from 'utils/conf'

const ajv = new Ajv({
  logger: {
    log: console.log.bind(console),
    warn: function warn() {
        console.log("WARN ! ", arguments)
    },
    error: function error() {
      console.error.apply(console, arguments);
    }
  }
});

const validate = ajv.compile(schema);    

export const validateData = data => {

  if (!config.VALIDATE_SCHEMA) {
    console.log("Data wasn't validated due to configuration")
    return true
  } else {
    console.log("Validating :", data, " with the schema :" , schema)
    const isValid = validate(data)
    
    if (!isValid) console.log(ajv);
    
    return isValid;
    // return ajv.addSchema(schema, 'data').validate('data', data);
  }
}