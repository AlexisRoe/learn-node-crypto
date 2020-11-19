import { useState } from 'react';

const useAsync = (action) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const doFetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const newData = await action();
            setData(newData);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    return { loading, error, data, doFetch };
};

export default useAsync;
