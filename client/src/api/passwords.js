export async function getPassword(passwordID) {
    const response = await fetch(`/password/id/${passwordID}`);
    const data = await response.json();
    const password = [data.name, data.value];
    return password;
}

export async function searchPassword(query) {
    const response = await fetch(`/password/${query}`);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    const passwords = await response.json();
    return passwords;
}
