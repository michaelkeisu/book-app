export default (error) => {
    var errors = error.errors;
    return Object.keys(errors).map((errorName) => {
        if (errors[errorName].message) {
            return errors[errorName].message;
        }
    });
}