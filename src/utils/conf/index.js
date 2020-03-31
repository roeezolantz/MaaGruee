const optionalBoolean = (optionalValue) => optionalValue !== 'false' // default is true

const config = {
    GENERATE_COLORS : optionalBoolean(process.env.REACT_APP_GENERATE_COLORS),
    API_ADDRESS: process.env.REACT_APP_API_ADDRESS || false,
    READ_ONLY: optionalBoolean(process.env.REACT_APP_READ_ONLY),
    VALIDATE_SCHEMA: optionalBoolean(process.env.REACT_APP_VALIDATE_SCHEMA),
    ENFORCE_PATH_CASING: optionalBoolean(process.env.REACT_APP_ENFORCE_PATH_CASING),
    ALLOW_UNSAVED_CONFIGURATIONS_HISTORY: optionalBoolean(process.env.REACT_APP_ALLOW_UNSAVED_CONFIGURATIONS_HISTORY),
    SIZE_RATIO_TO_KB: +process.env.REACT_APP_SIZE_RATIO_TO_KB || 1,
}

export default config;