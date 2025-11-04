// A simple function to rewrite the insecure URL to use the proxy
export const proxifyImageUrl = (url) => {
  if (!url) {
    return null;
  }
  // Find the /media/ part and return everything after it
  if (url.includes('/media/')) {
    return url.split('/media/')[1] ? `/media/${url.split('/media/')[1]}` : null;
  }
  return url;
};