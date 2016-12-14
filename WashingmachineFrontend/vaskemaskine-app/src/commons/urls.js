// TODO change to https
let base_url = '';
if (process.env.NODE_ENV === 'production') {
    base_url = 'http://138.68.83.5/ajax'
}

const urls = {
    api: {
        auth: `${base_url}/auth`,
        booking: `${base_url}/booking`,
        user: `${base_url}/user`,
        usage: `${base_url}/usage`
    }
};

export default urls;

