export default function(url) {
    return fetch(url, {
        method: 'GET',
        mode:'cors',
        credentials: 'include'
      }).then(res => res.json());
}