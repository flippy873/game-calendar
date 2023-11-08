const API_KEY = 'Your_Api_Key';

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();


function stripHtmlTags(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent || "";
}