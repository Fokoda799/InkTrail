// Check if the id is valid

const idValidation = (id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return false;
    }
    return true;
}

export default idValidation;