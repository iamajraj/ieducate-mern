export default (mail) => {
    if (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(mail)) {
        return true;
    }
    return false;
};
