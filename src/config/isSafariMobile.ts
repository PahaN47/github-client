const ua = window.navigator.userAgent;
const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
const webkit = !!ua.match(/WebKit/i);
export const isSafariMobile = iOS && webkit && !ua.match(/CriOS/i);
