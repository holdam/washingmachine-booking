// TODO change to https
let base_url = '';
if (process.env.NODE_ENV === 'production') {
    base_url = 'ajax'
}

const urls = {
    api: {
        auth: `${base_url}/auth`,
        booking: `${base_url}/booking`,
        user: `${base_url}/user`,
        usage: `${base_url}/usage`
    }
};

// TODO if prod prepend ajax
export default urls;

