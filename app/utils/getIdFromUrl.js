export default function getIdFromUrl(url) {
    return url?.split('/')?.[6] ?? '';
} 
